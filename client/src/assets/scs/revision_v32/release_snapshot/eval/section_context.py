"""Python counterpart of the non-scoring sectionWarning response."""
SENSITIVE={'CHR_07','CHR_08','CHR_12','CHR_15','CHR_17'}
def section_warning(observations,rules):
    obs={c:o if isinstance(o,dict) else {'value':o,'state':'PRESENT'} for c,o in observations.items()}
    section=obs.get('CHR_21',{})
    if section.get('state') in ['NOT_OBSERVABLE','UNCERTAIN'] or section.get('value') not in ['OBLIQUE','TANGENTIAL']:return None
    affected=[]
    for r in rules:
        chars=sorted({m.get('chr_id',m.get('chrId')) for m in r.get('mappings',[]) if m.get('chr_id',m.get('chrId')) in SENSITIVE})
        chars=[c for c in chars if obs.get(c,{}).get('value') and obs[c].get('state') not in ['NOT_OBSERVABLE','UNCERTAIN']]
        if chars:affected.append({'genus':r['genus'],'ruleKey':r.get('rule_key'),'characters':chars})
    if not affected:return None
    return {'code':'SECTION_SENSITIVITY','orientation':section['value'],'characters':sorted({c for r in affected for c in r['characters']}),'rules':affected,'scoringChanged':False,
      'message':'Verify these observations in an appropriate axial or equatorial section; the warning does not alter evidence.'}
