// Usage: node scripts/patterns-sheet.js out.svg
const fs = require('fs');
const { single } = require('../lib/render');
const { THEMES } = require('../lib/themes');
const samples = {
  'stark-forge': ['stars', '12.4k'], latveria: ['forks', '980'], asgard: ['license', 'MIT'], wakanda: ['release', 'v2.1.0'],
  'star-shield': ['issues', '42'], gamma: ['size', '2.0 MB'], 'red-room': ['commit', '3 days ago'], 'web-slinger': ['PRs', '7'],
  'mystic-arts': ['language', 'Python'], infinity: ['contributors', '1.2k'],
};
const notes = { 'stark-forge': 'arc rings', latveria: 'plates + rivets', asgard: 'lightning', wakanda: 'woven lattice', 'star-shield': 'stars + stripes', gamma: 'cracks', 'red-room': 'reticle + split', 'web-slinger': 'spider web', 'mystic-arts': 'sling-ring mandala', infinity: 'cosmos + stones' };
const f1 = (n) => n.toFixed(1);
const only = process.argv[3] ? process.argv[3].split(',') : Object.keys(THEMES);
const COLS = Number(process.argv[4] || 2), S = Number(process.argv[5] || 1.6), CW = Math.floor(400 / COLS), RH = Math.ceil(100 * S) + 50;
let body = '';
only.forEach((k, i) => {
  const col = i % COLS, row = Math.floor(i / COLS), x = 10 + col * CW, y = 14 + row * RH;
  let svg = single({ label: samples[k][0], message: samples[k][1], theme: k });
  const w = Number(svg.match(/width="([\d.]+)"/)[1]) * S, h = Number(svg.match(/height="([\d.]+)"/)[1]) * S;
  svg = svg.replace(/width="[\d.]+" height="[\d.]+"/, `x="${f1(x + (CW - w) / 2)}" y="${f1(y + (RH - 40 - h) / 2)}" width="${f1(w)}" height="${f1(h)}"`);
  body += svg;
  body += `<text x="${x + CW / 2}" y="${y + RH - 32}" text-anchor="middle" fill="#e6edf3" font-family="Verdana,DejaVu Sans,sans-serif" font-size="12" font-weight="bold">${THEMES[k].title}</text>`;
  body += `<text x="${x + CW / 2}" y="${y + RH - 16}" text-anchor="middle" fill="#8b949e" font-family="Verdana,DejaVu Sans,sans-serif" font-size="10.5">${notes[k]}</text>`;
});
const H = 14 + Math.ceil(only.length / COLS) * RH + 6;
fs.writeFileSync(process.argv[2] || 'patterns.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="${H}" viewBox="0 0 420 ${H}"><rect width="420" height="${H}" fill="#0d1117"/>${body}</svg>`);
