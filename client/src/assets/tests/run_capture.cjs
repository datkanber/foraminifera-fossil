// Read-only public WoRMS genus-name lookup. Never infer missing authorities.
const fs=require('node:fs');const path=require('node:path');
const repo=path.resolve(__dirname,'../../../../..');const out=path.resolve(__dirname,'../supplementary/S1_knowledge_base');fs.mkdirSync(out,{recursive:true});
const names=[...new Set(JSON.parse(fs.readFileSync(path.join(repo,'api/data/rule_chr_mapping.json'))).map(r=>r.genus))].sort();
const rows=[];let cursor=0;let chain=Promise.resolve();let last=0;const delay=ms=>new Promise(r=>setTimeout(r,ms));
const slot=()=>{const p=chain.then(async()=>{await delay(Math.max(0,last+550-Date.now()));last=Date.now();});chain=p;return p;};
(async()=>{
 await Promise.all(Array.from({length:4},async()=>{
  while(cursor<names.length){const genus=names[cursor++];await slot();
   const url='https://www.marinespecies.org/rest/AphiaRecordsByName/'+encodeURIComponent(genus)+'?like=false&marine_only=false';
   let row={queried_genus:genus,queried_at:new Date().toISOString(),query_url:url};
   try{const response=await fetch(url,{signal:AbortSignal.timeout(10000)});const results=response.status===204?[]:await response.json();
    const exact=Array.isArray(results)?results.filter(r=>r.scientificname?.toLowerCase()===genus.toLowerCase()&&r.rank?.toLowerCase()==='genus'):[];
    const record=exact.find(r=>r.status==='accepted'&&r.phylum==='Foraminifera')||exact.find(r=>r.phylum==='Foraminifera')||exact.find(r=>r.status==='accepted')||exact[0];
    row={...row,http_status:response.status,lookup_status:record?'record_found':'not_found',aphia_id:record?.AphiaID??null,authority:record?.authority??null,
      status:record?.status??null,accepted_name:record?.valid_name??null,accepted_aphia_id:record?.valid_AphiaID??null,
      phylum:record?.phylum??null,family:record?.family??null,source_url:record?.url??url,raw_record:record||null};
   }catch(e){row={...row,lookup_status:'unavailable',error:e.message};}
   rows.push(row);fs.writeFileSync(path.join(out,'S1_WoRMS_authorities.json'),JSON.stringify(rows.sort((a,b)=>a.queried_genus.localeCompare(b.queried_genus)),null,2));
  }
 }));
 const keys=['queried_genus','lookup_status','aphia_id','authority','status','accepted_name','accepted_aphia_id','phylum','family','source_url','queried_at'];const q=x=>'"'+String(x??'').replaceAll('"','""')+'"';
 fs.writeFileSync(path.join(out,'S1_WoRMS_authorities.csv'),keys.join(',')+'\n'+rows.map(r=>keys.map(k=>q(r[k])).join(',')).join('\n')+'\n');
 console.log(JSON.stringify({queried:rows.length,found:rows.filter(r=>r.lookup_status==='record_found').length,not_found:rows.filter(r=>r.lookup_status==='not_found').length,unavailable:rows.filter(r=>r.lookup_status==='unavailable').length}));
})();
