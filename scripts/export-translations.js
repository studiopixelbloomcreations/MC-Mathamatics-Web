const fs = require('fs');

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const si = JSON.parse(fs.readFileSync('messages/si.json', 'utf8'));

function flatten(obj, prefix = '') {
  let res = {};
  for (const k of Object.keys(obj)) {
    const val = obj[k];
    const full = prefix ? prefix + '.' + k : k;
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      Object.assign(res, flatten(val, full));
    } else {
      res[full] = val;
    }
  }
  return res;
}

const flatEn = flatten(en);
const flatSi = flatten(si);

let csv = 'Key,English,Sinhala\n';
for (const k of Object.keys(flatEn)) {
  const enVal = ('' + flatEn[k]).replace(/"/g, '""');
  const siVal = ('' + (flatSi[k] || '')).replace(/"/g, '""');
  csv += `"${k}","${enVal}","${siVal}"\n`;
}

fs.writeFileSync('docs/TRANSLATION_REVIEW.csv', csv, 'utf8');
console.log('docs/TRANSLATION_REVIEW.csv written successfully.');
