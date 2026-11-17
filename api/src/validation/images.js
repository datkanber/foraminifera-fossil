const { fail, digest } = require('./common');
const MAX_BYTES = 8 * 1024 * 1024;
async function sanitizeImage(base64) {
  fail(typeof base64 === 'string' && base64.length <= Math.ceil(MAX_BYTES / 3) * 4 && /^[A-Za-z0-9+/]+={0,2}$/.test(base64), 'Upload a PNG, JPEG or WebP image, at most 8 MB');
  const source = Buffer.from(base64, 'base64');
  fail(source.length <= MAX_BYTES && source.length > 0, 'Image exceeds 8 MB');
  const sharp = require('sharp');
  const options = { limitInputPixels: 40_000_000, failOn: 'warning' };
  let info, data;
  try {
    info = await sharp(source, options).metadata();
    fail(['png', 'jpeg', 'webp'].includes(info.format) && (info.pages || 1) === 1 && (info.depth || 'uchar') === 'uchar', 'Only single-view 8-bit PNG/JPEG/WebP images are supported');
    // Lossless PNG; no resize, enhancement or generated pixels. EXIF rotation
    // is applied before all identifying metadata is stripped.
    data = await sharp(source, options).autoOrient().png().toBuffer();
  } catch (e) { if (e.status) throw e; fail(false, 'Image cannot be safely decoded'); }
  fail(data.length <= 16 * 1024 * 1024, 'Decoded image is too large; upload a smaller view');
  return { data: data.toString('base64'), sha256: digest(data), originalSha256: digest(source), mime: 'image/png',
    width: info.autoOrient?.width || info.width, height: info.autoOrient?.height || info.height };
}
module.exports = { sanitizeImage };
