const test=require('node:test'),assert=require('node:assert/strict');
const {records}=require('../data/taxonomic_validation.json');
test('Idalina rejects the documented molluscan homonym without inventing an AphiaID',()=>{
 const r=records.find(x=>x.local_genus==='Idalina');assert.equal(r.rejected_homonym_AphiaID,761200);
 assert.equal(r.verified_foraminifer_AphiaID,null);assert.equal(r.PBDB_taxon_no,1662);
});
test('Historical Planocamerinoides is distinguished from its accepted registry target',()=>{
 const r=records.find(x=>x.local_genus==='Planocamerinoides');assert.equal(r.queried_status,'unaccepted');
 assert.equal(r.queried_AphiaID,848836);assert.equal(r.accepted_AphiaID,520941);assert.equal(r.accepted_name,'Nummulites');
});
