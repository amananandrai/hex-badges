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
  const r = Math.max(36, Math.ceil((maxW + 8) / (Math.sqrt(3) * 0.85)));
  const w = Math.ceil(Math.sqrt(3) * r), h = 2 * r, cx = w / 2, cy = r;
  const pts = [0, 1, 2, 3, 4, 5].map((k) => {
    const a = ((-90 + 60 * k) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  const body =
    `<polygon points="${pts}" fill="${color(c, COLORS.blue)}"/>` +
    `<g fill="#fff" font-family="${FONT}" text-anchor="middle" dominant-baseline="central">` +
    `<text x="${cx}" y="${cy - 8}" font-size="10">${esc(label)}</text>` +
    `<text x="${cx}" y="${cy + 9}" font-size="13" font-weight="bold">${esc(message)}</text></g>`;
  return svgWrap(w, h, label, message, body);
}

module.exports = { wide, single };
