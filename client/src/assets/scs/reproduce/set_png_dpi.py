"""Set publication DPI metadata without decoding, resampling or changing PNG pixels."""
from pathlib import Path
import hashlib
import json
import struct
import zlib

ROOT = Path(__file__).resolve().parent.parent
PPM = 11812  # 300.0248 dpi: PNG stores an integer number of pixels per metre.
manifest = []
for path in sorted(p for p in ROOT.glob('Figure_*.png') if p.name.startswith(('Figure_10_', 'Figure_15_'))):
    data = path.read_bytes()
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
    chunks = []
    pos = 8
    while pos < len(data):
        size = struct.unpack('>I', data[pos:pos + 4])[0]
        kind = data[pos + 4:pos + 8]
        payload = data[pos + 8:pos + 8 + size]
        end = pos + 12 + size
        assert zlib.crc32(kind + payload) & 0xffffffff == struct.unpack('>I', data[end - 4:end])[0]
        chunks.append((kind, payload, data[pos:end]))
        pos = end
    pixels_before = hashlib.sha256(b''.join(p for k, p, raw in chunks if k == b'IDAT')).hexdigest()
    phys = struct.pack('>IIB', PPM, PPM, 1)
    block = struct.pack('>I', len(phys)) + b'pHYs' + phys + struct.pack('>I', zlib.crc32(b'pHYs' + phys) & 0xffffffff)
    output = data[:8]
    for kind, payload, raw in chunks:
        if kind != b'pHYs':
            output += raw
        if kind == b'IHDR':
            output += block
            width, height = struct.unpack('>II', payload[:8])
    path.write_bytes(output)
    from PIL import Image
    with Image.open(path) as check:
        assert check.size == (width, height)
        assert min(check.info['dpi']) >= 300
        check.verify()
    # Every IDAT chunk is preserved byte for byte by the operation above.
    assert all(raw in output for k, p, raw in chunks if k == b'IDAT')
    manifest.append({
        'file': path.name, 'width_px': width, 'height_px': height,
        'dpi': round(PPM * 0.0254, 4), 'bytes': len(output),
        'sha256': hashlib.sha256(output).hexdigest(), 'idat_sha256': pixels_before,
        'pixel_data_unchanged_by_dpi_metadata': True,
    })

dest = ROOT / 'evidence' / 'image_manifest.json'
dest.parent.mkdir(exist_ok=True)
dest.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print(json.dumps(manifest, indent=2))
