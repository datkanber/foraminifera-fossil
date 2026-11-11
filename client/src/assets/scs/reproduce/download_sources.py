"""Download the three openly licensed source PDFs and verify the frozen hashes."""
from pathlib import Path
import hashlib
import requests

REPO=Path(__file__).resolve().parents[5]
DEST=REPO/'eval/literature_pilot/sources'
DEST.mkdir(parents=True,exist_ok=True)
SOURCES=[
 ('Schlagintweit_Hadi_2018_Coskinolina.pdf','https://zenodo.org/api/records/13190022/files/source.pdf/content','af41748df3e3b8d1533b5cbff94142cd2c2dcd088be59a63a31bf241f1fd6c3b'),
 ('Mattern_2024_Jafnayn.pdf','https://mdpi-res.com/d_attachment/geosciences/geosciences-14-00352/article_deploy/geosciences-14-00352.pdf','0a1c4a6ed8be0ed27a3de9f3499f0dcceae542e8598aedf5ba5d8c6260aac11a'),
 ('BoudagherFadel_2018_LBF.pdf','https://discovery.ucl.ac.uk/id/eprint/10047587/13/Evolution-and-Geological-Significance-of-Larger-Benthic-Foraminifera.pdf','6d1cdf7d0d8fa87378b4c125bd75920572b706d2bbb6008e75e9ebfbfdb1e5b1'),
]
for name,url,expected in SOURCES:
 p=DEST/name
 if not p.exists():
  response=requests.get(url,timeout=90);response.raise_for_status()
  assert response.content.startswith(b'%PDF')
  p.write_bytes(response.content)
 actual=hashlib.sha256(p.read_bytes()).hexdigest()
 assert actual==expected, f'Source changed: {name}; review before rebuilding the panel'
 print(name,'SHA-256 verified')
