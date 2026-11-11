"""Reproduce the source-labelled exploratory panel; never generate scientific imagery.

Requires Pillow and PyMuPDF. Set PYTHONPATH to the installed dependency directories
if they are not installed globally. Run from the repository root.
"""
from pathlib import Path
from io import BytesIO
import collections
import hashlib
import json
import csv
import pymupdf
from PIL import Image

REPO = Path(__file__).resolve().parents[5]
OUT = REPO / 'client/src/assets/scs/evaluation'
SOURCES = REPO / 'eval/literature_pilot/sources'
OUT.mkdir(exist_ok=True)
(OUT / 'images').mkdir(exist_ok=True)
book = pymupdf.open(SOURCES / 'BoudagherFadel_2018_LBF.pdf')
cos = pymupdf.open(SOURCES / 'Schlagintweit_Hadi_2018_Coskinolina.pdf')
mat = pymupdf.open(SOURCES / 'Mattern_2024_Jafnayn.pdf')
rules = json.loads((REPO / 'api/data/rule_chr_mapping.json').read_text(encoding='utf-8'))
modules = {r['genus']: r['module'] for r in rules}
candidates = []

def image_on_page(doc, page_number, render=False):
    page = doc[page_number - 1]
    item = max(page.get_images(), key=lambda x: x[2] * x[3])
    if render:
        rect = page.get_image_rects(item[0])[0]
        pix = page.get_pixmap(matrix=pymupdf.Matrix(item[2] / rect.width, item[2] / rect.width), clip=rect)
        return Image.open(BytesIO(pix.tobytes('png'))).convert('RGB')
    pix = pymupdf.Pixmap(doc.extract_image(item[0])['image'])
    return Image.open(BytesIO(pix.tobytes('png'))).convert('RGB')

def add(source, page, plate, panel, genus, image, box, group, note=''):
    assert genus in modules
    x0, y0, x1, y1 = box
    box = (max(0, x0), max(0, y0), min(image.width, x1), min(image.height, y1))
    assert box[2] > box[0] and box[3] > box[1]
    candidates.append(dict(source=source, page=page, plate=plate, panel=str(panel), genus=genus,
        module=modules[genus], crop_box=list(box), cluster=group, note=note, image=image.crop(box)))

# Development probe was Fig. 4a. It is excluded from this frozen panel.
cos_boxes = {
  5: [('b',(438,40,610,251),'CH4'),('c',(610,39,750,280),'CH4'),('d',(647,10,1230,536),'CH12'),
      ('e',(18,526,512,966),'CH4'),('f',(532,592,738,865),'CH12'),('g',(714,540,1230,1083),'CH2'),
      ('h',(486,895,740,1332),'CH2'),('i',(800,1088,1103,1408),'CH7'),('j',(533,1347,807,1643),'CH12'),
      ('k',(931,1408,1216,1656),'CH12'),('l',(25,984,454,1654),'CH12')],
  6: [('a',(13,10,563,331),'CH2'),('b',(574,67,787,281),'CH7'),('c',(732,8,1194,453),'CH2'),
      ('d',(15,338,386,695),'CH2'),('e',(387,307,802,615),'CH2'),('f',(877,470,1155,802),'CH2'),
      ('g',(16,718,423,1043),'CH2'),('h',(427,632,881,1017),'CH2'),('i',(868,831,1160,1177),'CH12'),
      ('j',(17,1080,487,1537),'CH4'),('k',(510,1060,879,1435),'CH12'),('l',(886,1250,1186,1565),'CH12')],
}
for page, boxes in cos_boxes.items():
    image = image_on_page(cos, page)
    for label, box, group in boxes:
        add('Schlagintweit_Hadi_2018', page, str(page-1), label, 'Coskinolina', image, box, 'COS_'+group,
            'Published section figure; some rectangular crops include parts of adjacent sections of the same genus. Original structural annotations retained.')

# The publisher split Figure 15 into two consecutive raster strips.
parts = [Image.open(BytesIO(mat.extract_image(x)['image'])).convert('RGB') for x in (154,155)]
combined = Image.new('RGB', (parts[0].width, sum(p.height for p in parts)), 'white')
y = 0
for p in parts:
    combined.paste(p, (0,y)); y += p.height
for panel, box, sample in [
    ('A',(200,370,1080,650),'1'), ('B',(1670,300,2490,745),'4'),
    ('C',(100,1120,800,1830),'7'), ('D',(1640,1290,2690,1980),'8'),
    ('E',(780,2300,2110,3000),'11')]:
    add('Mattern_2024',23,'15',panel,'Alveolina',combined,box,'MATTERN_sample_'+sample,
        'Focal section cropped to exclude embedded taxon-name label; no enhancement or invented pixels. Scale may be outside crop; original plate retained in source PDF.')

# UCL Press book is explicitly a knowledge-base reference: report separately.
# Labels follow plate captions. Oligocene/Miocene panels, stated SEM/solid tests,
# explicit enlargements, mixed-genus fields without a focal genus, and ambiguous
# caption numbering are omitted. Known source-reference overlap is not concealed.
B = {}
def plate(page, number, genus, items):
    if page not in B: B[page] = (number, [])
    for label, box in items: B[page][1].append((label,genus,box))

plate(510,'6.1','Barattolites',[(18,(0,967,171,1182))])
plate(510,'6.1','Coskinolina',[(22,(548,702,778,953)),(23,(612,960,778,1182))])
plate(512,'6.2','Coskinolina',[(1,(0,0,179,228)),(2,(181,0,371,228)),(10,(201,456,380,676))])
plate(512,'6.2','Dictyoconus',[(7,(431,228,620,452)),(8,(619,226,778,452)),(9,(0,454,201,678))])
plate(512,'6.2','Alveolina',[(15,(226,695,548,900)),(16,(548,689,778,946)),(17,(0,901,548,1039)),(19,(465,998,778,1180))])
plate(512,'6.2','Glomalveolina',[(18,(0,1051,465,1180))])
plate(513,'6.3','Alveolina',[(1,(0,0,460,361)),(2,(0,372,447,709)),(3,(460,0,789,401)),(4,(447,398,789,710)),(6,(306,714,789,959))])
plate(515,'6.4','Alveolina',[(1,(0,0,233,235)),(3,(501,0,767,230)),(4,(0,235,388,537)),(6,(0,540,389,857)),(7,(396,457,767,682)),(8,(394,683,767,946)),(9,(0,855,238,1169)),(10,(237,907,517,1169)),(11,(515,943,767,1169))])
plate(516,'6.5','Alveolina',[(1,(0,0,288,234)),(2,(289,0,756,234)),(3,(0,233,530,444)),(4,(532,234,756,447)),(14,(322,932,756,1156))])
plate(516,'6.5','Nummulites',[(11,(633,720,756,932))])
plate(516,'6.5','Assilina',[(13,(322,932,539,1156))])
# Fig.14 overlaps the neighbouring Fig.13 field in the source: use only its right focal section.
B[516][1][:] = [(n,g,((540,934,756,1156) if n==14 else b)) for n,g,b in B[516][1]]
plate(522,'6.9','Glomalveolina',[(1,(0,0,258,194))])
plate(522,'6.9','Fabularia',[(4,(580,0,752,196)),(5,(0,197,309,390)),(6,(306,194,462,393)),(7,(460,197,580,394))])
plate(522,'6.9','Lacazina',[(9,(0,390,300,698))])
plate(522,'6.9','Lacazinella',[(10,(300,396,470,692)),(11,(475,411,752,696))])
plate(527,'6.12','Nummulites',[(2,(371,0,786,337))])
plate(528,'6.13','Ranikothalia',[(3,(350,0,580,254))])
plate(528,'6.13','Miscellanea',[(4,(580,0,742,246)),(5,(0,268,258,530)),(6,(258,269,403,530)),(7,(404,251,560,503)),(8,(560,246,718,495)),(9,(0,530,331,859)),(10,(0,886,297,1181)),(12,(332,500,699,839)),(15,(518,836,801,1181))])
plate(529,'6.14','Assilina',[(8,(0,530,291,741)),(9,(397,535,465,930))])
plate(529,'6.14','Heterostegina',[(13,(0,931,239,1147))])
plate(530,'6.15','Spiroclypeus',[(11,(0,875,214,1068)),(12,(217,873,494,1068)),(13,(486,846,706,1068))])
plate(530,'6.15','Ranikothalia',[(14,(527,0,576,420))])
plate(531,'6.16','Discocyclina',[(3,(548,0,797,315)),(12,(307,924,570,1206))])
plate(531,'6.16','Nemkovella',[(9,(0,618,409,925))])
plate(531,'6.16','Nummulites',[(11,(0,926,308,1206))])
plate(533,'6.17','Assilina',[(2,(386,0,791,326)),(4,(467,325,541,709)),(5,(540,323,669,684)),(8,(440,678,543,1146))])
plate(534,'6.18','Assilina',[(1,(0,0,320,310)),(2,(331,15,777,234)),(3,(310,232,715,315))])
plate(534,'6.18','Nummulites',[(8,(369,683,777,961))])
plate(534,'6.18','Operculina',[(9,(0,959,203,1197)),(11,(290,955,777,1046)),(12,(320,1044,777,1197))])
plate(536,'6.19','Nummulites',[(5,(302,364,797,573)),(6,(0,535,375,910)),(7,(374,572,797,910)),(8,(0,910,409,1201))])
plate(537,'6.20','Nummulites',[(1,(0,0,344,253)),(2,(367,0,767,254)),(3,(0,252,252,470)),(4,(250,256,495,466)),(5,(490,229,701,516))])
plate(537,'6.20','Assilina',[(6,(699,254,767,701)),(9,(357,472,427,823)),(10,(428,470,495,824)),(11,(494,514,701,707))])
plate(537,'6.20','Chordoperculinoides',[(16,(245,911,509,1152))])
plate(539,'6.21','Nummulites',[(1,(0,0,238,253)),(2,(242,0,523,255)),(3,(520,0,630,252)),(5,(0,251,272,446)),(7,(572,239,781,447)),(10,(583,446,781,733)),(12,(297,732,571,952)),(16,(513,946,781,1188))])
plate(540,'6.22','Ranikothalia',[(1,(0,0,195,235)),(3,(475,0,744,215)),(5,(390,214,744,468))])
plate(540,'6.22','Discocyclina',[(8,(493,453,744,702)),(9,(0,671,362,789)),(11,(0,780,305,923)),(12,(0,918,242,1133))])
plate(543,'6.24','Discocyclina',[(1,(0,0,462,117)),(7,(0,501,380,864))])
plate(543,'6.24','Asterocyclina',[(9,(382,553,746,866)),(10,(0,857,352,1137))])
plate(544,'6.25','Discocyclina',[(7,(649,297,812,724))])
plate(544,'6.25','Laffitteina',[(11,(359,950,632,1187)),(12,(638,951,812,1187))])
plate(546,'6.27','Orbitoclypeus',[(2,(0,103,373,223))])
plate(546,'6.27','Daviesina',[(13,(0,1024,444,1206)),(14,(449,877,798,1206))])
plate(548,'6.28','Dictyoconus',[(5,(276,264,440,440))])
plate(548,'6.28','Rotalia',[(9,(280,438,423,573)),(10,(421,448,658,572)),(11,(654,450,779,574))])
plate(548,'6.28','Lockhartia',[(12,(0,577,193,731)),(13,(193,577,370,731)),(14,(372,576,521,733)),(15,(520,572,657,733)),(16,(657,573,779,734)),(17,(0,729,199,858)),(22,(0,851,208,974))])
plate(548,'6.28','Cuvillierina',[(20,(487,736,779,936)),(21,(0,975,208,1185))])
plate(548,'6.28','Kathina',[(24,(208,968,487,1082)),(25,(208,1082,487,1185))])
plate(548,'6.28','Daviesina',[(26,(488,937,779,1185))])

for page, (number, items) in sorted(B.items()):
    image = image_on_page(book,page,render=True)
    for panel,genus,box in sorted(items):
        add('BoudagherFadel_2018',page,number,panel,genus,image,box,'UCL_plate_'+number,
            'Known KB-reference source overlap; original numbered figure and scale retained. Source plate used as a conservative dependence cluster; specimen independence is not asserted.')

# Fixed selection before running the 150 image analyses: all 28 article panels,
# then the first 122 eligible reference-book panels in plate/panel order.
assert len(candidates) >= 150, len(candidates)
selected = candidates[:150]
manifest = []
seen = set()
for i, row in enumerate(selected,1):
    image = row.pop('image')
    image_id = f'IMG_{i:03d}'
    dest = OUT / 'images' / f'{image_id}.png'
    image.save(dest,format='PNG')
    digest = hashlib.sha256(dest.read_bytes()).hexdigest()
    assert digest not in seen, f'Duplicate raster: {row}'
    seen.add(digest)
    row.update(image_id=image_id,file=f'images/{image_id}.png',width=image.width,height=image.height,
        sha256=digest,reference_genus=row.pop('genus'),license='CC-BY-4.0',
        cohort='KB reference book (overlap)' if row['source']=='BoudagherFadel_2018' else 'Additional articles',
        age_scope='Paleocene-Eocene',human_expert_sheet=False)
    manifest.append(row)

payload = json.dumps(manifest,indent=2,ensure_ascii=False)+'\n'
(OUT/'panel_manifest.json').write_text(payload,encoding='utf-8')
with (OUT/'panel_manifest.csv').open('w',encoding='utf-8-sig',newline='') as f:
    writer = csv.DictWriter(f,fieldnames=manifest[0].keys());writer.writeheader();writer.writerows(manifest)
summary = dict(n_images=len(manifest),n_genera=len({x['reference_genus'] for x in manifest}),
    by_module=dict(collections.Counter(x['module'] for x in manifest)),
    by_cohort=dict(collections.Counter(x['cohort'] for x in manifest)),
    n_source_clusters=len({x['cluster'] for x in manifest}),
    manifest_sha256=hashlib.sha256(payload.encode()).hexdigest(),
    selection='28 article panels, then first 122 eligible book panels in plate/panel order; fixed before outcome analysis.',
    independence='150 image panels, not 150 verified independent specimens. Source/reference overlap reported separately.',
    runs_per_image=1,development_probe='Coskinolina Fig.4a, excluded',
    evaluated_conditions=['VLM character sheet + released local engine (C4-like)'],
    excluded_conditions=['C1','C2','C3','B1 on expert sheets','expert-VLM character agreement','human timing'],
    model='configured api/.env model; recorded at execution',
    no_posthoc_tuning=True)
(OUT/'panel_freeze.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
print(json.dumps(summary,indent=2))
