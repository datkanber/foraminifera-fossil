// Pure normalization shared by HTTP and archived-receipt replay.
const {characters}=require('../../data/characters.json');
const neutral=new Set(['NOT_OBSERVABLE','UNCERTAIN']);
function normalizeObservations(raw){
 const source=raw&&typeof raw==='object'?raw:{};
 return Object.fromEntries(characters.map(c=>{
  const item=source[c.id]||{};let value=item.value===''?null:item.value??null;
  let state=['PRESENT','ABSENT',...neutral].includes(item.state)?item.state:'NOT_OBSERVABLE';
  if(value!==null&&!c.values.includes(value)){value=null;if(!neutral.has(state))state='NOT_OBSERVABLE';}
  if(!neutral.has(state)){
   if(value===null||['NOT_OBSERVABLE','UNCERTAIN','UNKNOWN'].includes(value))state='NOT_OBSERVABLE';
   else if(state==='ABSENT'&&!['ABSENT','NONE'].includes(value))state='UNCERTAIN';
  }
  return [c.id,{value,state,reason:typeof item.reason==='string'?item.reason:''}];
 }));
}
module.exports={normalizeObservations};
