const { scoreGenera } = require('./scoring');

// Dummy data based on Tablo XIII
const generaMap = {
  Ammodiscus: {
    genus: 'Ammodiscus',
    module: 'AGGLUTINATED',
    rules: [
      { level: 'MANDATORY', text: 'M1', mappings: [{ chrId: 'CHR_01', value: 'AGGLUTINATED' }] },
      { level: 'MANDATORY', text: 'M2', mappings: [{ chrId: 'CHR_04', value: 'UNDIVIDED' }, { chrId: 'CHR_02', value: 'TUBULAR' }] },
      { level: 'DIAGNOSTIC', text: 'D1', mappings: [{ chrId: 'CHR_06', value: 'PLANISPIRAL' }] },
      { level: 'SUPPORTING', text: 'S1', mappings: [{ chrId: 'CHR_08', value: 'EVOLUTE' }] }
    ]
  },
  Glomospira: {
    genus: 'Glomospira',
    module: 'AGGLUTINATED',
    rules: [
      { level: 'MANDATORY', text: 'M1', mappings: [{ chrId: 'CHR_01', value: 'AGGLUTINATED' }] },
      { level: 'MANDATORY', text: 'M2', mappings: [{ chrId: 'CHR_04', value: 'UNDIVIDED' }, { chrId: 'CHR_02', value: 'TUBULAR' }] },
      { level: 'DIAGNOSTIC', text: 'D1', mappings: [{ chrId: 'CHR_06', value: 'STREPTOSPIRAL' }] } // mismatch
    ]
  },
  Saccammina: {
    genus: 'Saccammina',
    module: 'AGGLUTINATED',
    rules: [
      { level: 'MANDATORY', text: 'M1', mappings: [{ chrId: 'CHR_01', value: 'AGGLUTINATED' }] },
      { level: 'MANDATORY', text: 'M2', mappings: [{ chrId: 'CHR_04', value: 'UNDIVIDED' }] },
      { level: 'DIAGNOSTIC', text: 'D1', mappings: [{ chrId: 'CHR_02', value: 'SAC_LIKE' }] }, // mismatch
      { level: 'SUPPORTING', text: 'S1', mappings: [{ chrId: 'CHR_08', value: 'EVOLUTE' }] }
    ]
  }
};

const obs = {
  CHR_01: { value: 'AGGLUTINATED', state: 'PRESENT' },
  CHR_02: { value: 'TUBULAR', state: 'PRESENT' },
  CHR_04: { value: 'UNDIVIDED', state: 'PRESENT' },
  CHR_06: { value: 'PLANISPIRAL', state: 'PRESENT' },
  CHR_08: { value: 'EVOLUTE', state: 'PRESENT' }
};

const result = scoreGenera(obs, generaMap);

console.log("Status:", result.status);
console.log("Identification:", result.identification);
console.log("Ranking:");
result.ranking.forEach((r, i) => {
  console.log(`${i+1}. ${r.genus} (Score: ${r.score})`);
});
