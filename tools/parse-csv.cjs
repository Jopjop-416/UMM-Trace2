const fs = require('fs');
const Papa = require('papaparse');

const path = require('path').join(__dirname, '..', 'Alumni 2000-2025.csv');
const text = fs.readFileSync(path, 'utf8');
const results = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
console.log('PARSE ERROR:', results.errors && results.errors.length ? results.errors.slice(0,5) : 'none');
const rows = results.data || [];
console.log('CSV HEADERS:', Object.keys(rows[0] || {}));
console.log('TOTAL CSV ROWS:', rows.length);
console.log('SAMPLE ROW 0:', rows[0]);
console.log('SAMPLE ROW 10:', rows[10]);
