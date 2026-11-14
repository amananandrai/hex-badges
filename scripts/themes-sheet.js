// Usage: node scripts/themes-sheet.js out.svg
const fs = require('fs');
const { wide, single } = require('../lib/render');
const { THEMES } = require('../lib/themes');

const samples = {
  'stark-forge': ['stars', '12.4k'], latveria: ['forks', '980'], asgard: ['license', 'MIT'],
  wakanda: ['release', 'v2.1.0'], 'star-shield': ['issues', '42'], gamma: ['size', '2.0 MB'],
  'red-room': ['commit', '3 days ago'], 'web-slinger': ['PRs', '7'], 'mystic-arts': ['language', 'Python'],
  infinity: ['contributors', '1.2k'],
};
const nest = (svg, x, y) => svg.replace('<svg ', `<svg x="${x}" y="${y}" `);
let body = '', y = 24;
Object.keys(THEMES).forEach((k, i) => {
  const t = THEMES[k], [label, message] = samples[k];
  const hex = single({ label, message, theme: k }), hh = Number(hex.match(/height="(\d+)"/)[1]);
  body += `<text x="20" y="${y + 14}" fill="#e6edf3" font-family="Verdana,DejaVu Sans,sans-serif" font-size="13" font-weight="bold">${i + 1}. ${t.title}</text>`;
  body += `<text x="20" y="${y + 31}" fill="#8b949e" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11">${t.note}</text>`;
  body += nest(wide({ label, message, theme: k }), 20, y + 50);
  body += nest(hex, 262, y - 4);
  y += Math.max(hh, 90) + 4;
});
const H = y + 10;
fs.writeFileSync(process.argv[2] || 'sheet.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="${H}" viewBox="0 0 420 ${H}"><rect width="420" height="${H}" fill="#0d1117"/>${body}</svg>`);
