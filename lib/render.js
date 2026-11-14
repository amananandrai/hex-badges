const { THEMES, hasTheme } = require('./themes');
const { PATTERNS } = require('./patterns');

const COLORS = {
  brightgreen: '#2e9d4f', green: '#3fa34d', yellow: '#dfb317', orange: '#c2570c',
  red: '#d1342f', blue: '#1f6feb', purple: '#8250df', lightgrey: '#9f9f9f', gray: '#555555',
};
const FONT = 'Verdana,DejaVu Sans,sans-serif';

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function color(c, fallback) {
  if (!c) return fallback;
  if (COLORS[c]) return COLORS[c];
  if (/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)) return c.startsWith('#') ? c : '#' + c;
  return fallback;
}

function textWidth(s, size) {
  return Math.ceil(String(s).length * size * 0.62);
}

function svgWrap(w, h, label, message, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}: ${esc(message)}"><title>${esc(label)}: ${esc(message)}</title>${body}</svg>`;
}

// Style B: elongated two-part hexagon
function wide({ label, message, color: c, labelColor }) {
  const h = 28, size = 11, pad = 10, tip = 8;
  const lw = textWidth(label, size) + pad * 2 + tip / 2;
  const rw = textWidth(message, size) + pad * 2 + tip / 2;
  const w = lw + rw, m = h / 2;
  const left = `${0},${m} ${tip},0 ${lw},0 ${lw},${h} ${tip},${h}`;
  const right = `${lw},0 ${w - tip},0 ${w},${m} ${w - tip},${h} ${lw},${h}`;
  const body =
    `<polygon points="${left}" fill="${color(labelColor, COLORS.gray)}"/>` +
    `<polygon points="${right}" fill="${color(c, COLORS.blue)}"/>` +
    `<g fill="#fff" font-family="${FONT}" font-size="${size}" text-anchor="middle" dominant-baseline="central">` +
    `<text x="${(lw + tip / 2) / 2}" y="${m + 1}">${esc(label)}</text>` +
    `<text x="${lw + (rw - tip / 2) / 2}" y="${m + 1}" font-weight="bold">${esc(message)}</text></g>`;
  return svgWrap(w, h, label, message, body);
}

// Style A: single pointy-top hexagon, label over message
function single({ label, message, color: c }) {
  const maxW = Math.max(textWidth(label, 10), textWidth(message, 13));
  const r = Math.min(46, Math.max(36, Math.ceil((maxW + 8) / (Math.sqrt(3) * 0.85))));
  const k = Math.min(1, (Math.sqrt(3) * r * 0.85) / (maxW + 8));
  const w = Math.ceil(Math.sqrt(3) * r), h = 2 * r, cx = w / 2, cy = r;
  const pts = [0, 1, 2, 3, 4, 5].map((k) => {
    const a = ((-90 + 60 * k) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  const body =
    `<polygon points="${pts}" fill="${color(c, COLORS.blue)}"/>` +
    `<g fill="#fff" font-family="${FONT}" text-anchor="middle" dominant-baseline="central">` +
    `<text x="${cx}" y="${cy - 8}" font-size="${(10 * k).toFixed(1)}">${esc(label)}</text>` +
    `<text x="${cx}" y="${cy + 9}" font-size="${(13 * k).toFixed(1)}" font-weight="bold">${esc(message)}</text></g>`;
  return svgWrap(w, h, label, message, body);
}


const grad = (id, [c1, c2]) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;

const glowFilter = (id, c) =>
  `<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%"><feFlood flood-color="${c}" result="f"/><feComposite in="f" in2="SourceAlpha" operator="in" result="c"/><feGaussianBlur in="c" stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

function wideThemed({ label, message, theme }) {
  const t = THEMES[theme], id = `${theme}-w`;
  const h = 28, size = 11, pad = 10, tip = 8, sw = 1.5;
  const lw = textWidth(label, size) + pad * 2 + tip / 2;
  const rw = textWidth(message, size) + pad * 2 + tip / 2;
  const w0 = lw + rw, m = h / 2, W = w0 + sw * 2, H = h + sw * 2;
  const left = `0,${m} ${tip},0 ${lw},0 ${lw},${h} ${tip},${h}`;
  const right = `${lw},0 ${w0 - tip},0 ${w0},${m} ${w0 - tip},${h} ${lw},${h}`;
  const outline = `0,${m} ${tip},0 ${w0 - tip},0 ${w0},${m} ${w0 - tip},${h} ${tip},${h}`;
  const body =
    `<defs>${grad(id + 'l', t.lab)}${grad(id + 'm', t.msg)}</defs><g transform="translate(${sw},${sw})">` +
    `<polygon points="${left}" fill="url(#${id}l)"/><polygon points="${right}" fill="url(#${id}m)"/>` +
    `<line x1="${lw}" y1="0" x2="${lw}" y2="${h}" stroke="${t.stroke}" stroke-opacity=".6"/>` +
    `<polygon points="${outline}" fill="none" stroke="${t.stroke}" stroke-width="${sw}" stroke-linejoin="round"/>` +
    `<g font-family="${FONT}" font-size="${size}" text-anchor="middle" dominant-baseline="central">` +
    `<text x="${(lw + tip / 2) / 2}" y="${m + 1}" fill="${t.labFg}">${esc(label)}</text>` +
    `<text x="${lw + (rw - tip / 2) / 2}" y="${m + 1}" fill="${t.msgFg}" font-weight="bold">${esc(message)}</text></g></g>`;
  return svgWrap(W, H, label, message, body);
}

function singleThemed({ label, message, theme, pattern }) {
  const t = THEMES[theme], id = `${theme}-s`;
  const maxW = Math.max(textWidth(label, 10), textWidth(message, 13));
  const r = Math.min(46, Math.max(36, Math.ceil((maxW + 8) / (Math.sqrt(3) * 0.85))));
  const k = Math.min(1, (Math.sqrt(3) * r * 0.85) / (maxW + 8));
  const w = Math.ceil(Math.sqrt(3) * r), h = 2 * r, cx = w / 2, cy = r, pad = 12;
  const ring = (rad) => [0, 1, 2, 3, 4, 5].map((k) => {
    const a = ((-90 + 60 * k) * Math.PI) / 180;
    return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  const body =
    `<defs>${grad(id + 'm', t.msg)}${glowFilter(id + 'g', t.glow)}</defs><g transform="translate(${pad},${pad})">` +
    `<g filter="url(#${id}g)"><polygon points="${ring(r - 1.5)}" fill="url(#${id}m)" stroke="${t.stroke}" stroke-width="2" stroke-linejoin="round"/></g>` +
    `<clipPath id="${id}c"><polygon points="${ring(r - 1.5)}"/></clipPath>` +
    (pattern === 'none' ? '' : `<g clip-path="url(#${id}c)">${PATTERNS[theme](cx, cy, r, t)}</g>`) +
    `<polygon points="${ring(r - 7)}" fill="none" stroke="${t.stroke}" stroke-opacity=".45" stroke-linejoin="round"/>` +
    `<g font-family="${FONT}" text-anchor="middle" dominant-baseline="central" fill="${t.msgFg}">` +
    `<text x="${cx}" y="${cy - 8}" font-size="${(10 * k).toFixed(1)}" fill-opacity=".85">${esc(label)}</text>` +
    `<text x="${cx}" y="${cy + 9}" font-size="${(13 * k).toFixed(1)}" font-weight="bold">${esc(message)}</text></g></g>`;
  return svgWrap(w + pad * 2, h + pad * 2, label, message, body);
}

const pick = (themedFn, plainFn) => (o) => (hasTheme(o.theme) ? themedFn(o) : plainFn(o));

module.exports = { wide: pick(wideThemed, wide), single: pick(singleThemed, single) };
