// Usage: node scripts/blog-images.js <outDir>   (writes cover.svg and wide-badges.svg)
const fs = require('fs');
const path = require('path');
const { wide, single } = require('../lib/render');
const { THEMES } = require('../lib/themes');

const out = process.argv[2] || '.';
const FONT = 'Verdana,DejaVu Sans,sans-serif';
const attr = (svg, n) => Number(svg.match(new RegExp(`${n}="([\\d.]+)"`))[1]);
const place = (svg, x, y, S) =>
  svg.replace(/width="[\d.]+" height="[\d.]+"/, `x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(attr(svg, 'width') * S).toFixed(1)}" height="${(attr(svg, 'height') * S).toFixed(1)}"`);

// Cover: 1000x420
let c = '<rect width="1000" height="420" fill="#0d1117"/>';
c += `<text x="60" y="150" fill="#e6edf3" font-family="${FONT}" font-size="58" font-weight="bold">hex-badges</text>`;
c += `<text x="60" y="196" fill="#8b949e" font-family="${FONT}" font-size="22">Avengers-themed hexagon badges</text>`;
c += `<text x="60" y="226" fill="#8b949e" font-family="${FONT}" font-size="22">for your README</text>`;
[[['stark-forge', 'stars', '12.4k'], ['asgard', 'license', 'MIT']], [['wakanda', 'release', 'v2.1.0'], ['latveria', 'forks', '980']]].forEach((row, i) => {
  let x = 60;
  row.forEach(([t, l, m]) => {
    const svg = wide({ label: l, message: m, theme: t }), S = 1.7;
    c += place(svg, x, 272 + i * 52, S);
    x += attr(svg, 'width') * S + 18;
  });
});
const S = 1.9, sp = 150;
[['stark-forge', 'stars', '12.4k', 0, 0], ['wakanda', 'release', 'v2.1.0', 1, 0], ['infinity', 'issues', '1.2k', 2, 0],
 ['star-shield', 'issues', '42', 0.5, 1], ['web-slinger', 'PRs', '7', 1.5, 1]].forEach(([t, l, m, col, row]) => {
  const svg = single({ label: l, message: m, theme: t });
  c += place(svg, 545 + col * sp, 28 + row * 128, S);
});
fs.writeFileSync(path.join(out, 'cover.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="420" viewBox="0 0 1000 420">${c}</svg>`);

// All ten themes, elongated style
const samples = { 'stark-forge': ['stars', '12.4k'], latveria: ['forks', '980'], asgard: ['license', 'MIT'], wakanda: ['release', 'v2.1.0'], 'star-shield': ['issues', '42'], gamma: ['size', '2.0 MB'], 'red-room': ['commit', '3 days ago'], 'web-slinger': ['PRs', '7'], 'mystic-arts': ['language', 'Python'], infinity: ['contributors', '1.2k'] };
let w = '';
Object.keys(THEMES).forEach((k, i) => {
  const col = i % 2, row = Math.floor(i / 2), x = 16 + col * 260, y = 16 + row * 66;
  w += `<text x="${x}" y="${y + 10}" fill="#8b949e" font-family="${FONT}" font-size="10.5">${THEMES[k].title}</text>`;
  w += place(wide({ label: samples[k][0], message: samples[k][1], theme: k }), x, y + 18, 1.3);
});
fs.writeFileSync(path.join(out, 'wide-badges.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="350" viewBox="0 0 520 350"><rect width="520" height="350" fill="#0d1117"/>${w}</svg>`);
