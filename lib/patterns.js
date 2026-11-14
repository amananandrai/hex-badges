const f = (n) => Number(n.toFixed(1));
const pol = (cx, cy, rad, deg) => [cx + rad * Math.cos((deg * Math.PI) / 180), cy + rad * Math.sin((deg * Math.PI) / 180)];
const pts = (arr) => arr.map(([x, y]) => `${f(x)},${f(y)}`).join(' ');
const line = (a, b, attrs) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" ${attrs}/>`;
const star = (cx, cy, R, attrs) => {
  const p = [];
  for (let i = 0; i < 10; i++) p.push(pol(cx, cy, i % 2 ? R * 0.4 : R, -90 + i * 36));
  return `<polygon points="${pts(p)}" ${attrs}/>`;
};
const ring = (cx, cy, rad, n) => Array.from({ length: n }, (_, i) => pol(cx, cy, rad, -90 + (360 / n) * i));

// Diagonal hatch lines across the bounding box (clipped to the hexagon by the caller).
function hatch(cx, cy, r, step, dir, attrs) {
  let out = '';
  for (let d = -2 * r; d <= 2 * r; d += step) {
    const a = dir > 0 ? [cx - r + d, cy + r] : [cx - r + d, cy - r];
    const b = dir > 0 ? [cx + r + d, cy - r] : [cx + r + d, cy + r];
    out += line(a, b, attrs);
  }
  return out;
}

const PATTERNS = {
  // concentric arc-reactor rings with ticks
  'stark-forge': (cx, cy, r, t) => {
    let s = `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.66)}" fill="none" stroke="${t.stroke}" stroke-opacity=".35"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.46)}" fill="none" stroke="${t.stroke}" stroke-opacity=".3"/>`;
    for (let i = 0; i < 16; i++) s += line(pol(cx, cy, r * 0.46, i * 22.5), pol(cx, cy, r * 0.66, i * 22.5), `stroke="${t.stroke}" stroke-opacity=".3"`);
    return s;
  },
  // armour plates and rivets
  latveria: (cx, cy, r, t) => {
    let s = '';
    [-0.38, 0.38].forEach((k) => (s += line([cx - r, cy + r * k], [cx + r, cy + r * k], `stroke="${t.stroke}" stroke-opacity=".4" stroke-width="1.5"`)));
    s += line([cx, cy - r], [cx, cy - r * 0.38], `stroke="${t.stroke}" stroke-opacity=".3"`);
    s += line([cx, cy + r * 0.38], [cx, cy + r], `stroke="${t.stroke}" stroke-opacity=".3"`);
    ring(cx, cy, r - 10, 6).forEach(([x, y]) => (s += `<circle cx="${f(x)}" cy="${f(y)}" r="1.7" fill="${t.stroke}" fill-opacity=".65"/>`));
    return s;
  },
  // lightning bolts
  asgard: (cx, cy, r, t) => {
    const bolt = (m) => `<polyline points="${pts([[0.5, -0.5], [0.68, -0.18], [0.54, -0.12], [0.76, 0.22], [0.62, 0.28], [0.8, 0.55]].map(([x, y]) => [cx + m * x * r, cy + y * r]))}" fill="none" stroke="${t.glow}" stroke-opacity=".75" stroke-width="1.6" stroke-linejoin="round"/>`;
    return bolt(1) + bolt(-1);
  },
  // woven diamond lattice
  wakanda: (cx, cy, r, t) => hatch(cx, cy, r, 11, 1, `stroke="${t.stroke}" stroke-opacity=".25"`) + hatch(cx, cy, r, 11, -1, `stroke="${t.stroke}" stroke-opacity=".25"`),
  // stars on top, stripes below
  'star-shield': (cx, cy, r) => {
    let s = '';
    [[-0.4, -0.7], [0, -0.78], [0.4, -0.7]].forEach(([x, y]) => (s += star(cx + x * r, cy + y * r, r * 0.09, 'fill="#fff" fill-opacity=".85"')));
    const top = cy + r * 0.56, n = Math.ceil((cy + r - top) / 4.5);
    for (let i = 0; i < n; i++) s += `<rect x="${f(cx - r)}" y="${f(top + i * 4.5)}" width="${f(r * 2)}" height="2.5" fill="${i % 2 ? '#fff' : '#e0313f'}" fill-opacity=".7"/>`;
    return s;
  },
  // radiating cracks
  gamma: (cx, cy, r) => {
    const crack = (pp) => `<polyline points="${pts(pp.map(([x, y]) => [cx + x * r, cy + y * r]))}" fill="none" stroke="#0b3410" stroke-opacity=".6" stroke-width="1.6" stroke-linejoin="round"/>`;
    return crack([[-1, -0.55], [-0.6, -0.45], [-0.5, -0.2], [-0.2, -0.1]]) +
      crack([[0.2, -1], [0.1, -0.7], [0.35, -0.55], [0.3, -0.3]]) +
      crack([[1, 0.4], [0.65, 0.35], [0.55, 0.6], [0.25, 0.55]]) +
      crack([[-0.3, 1], [-0.25, 0.7], [-0.5, 0.55]]);
  },
  // targeting reticle over a black diagonal split
  'red-room': (cx, cy, r) => {
    const half = pts([[cx - 1.1 * r, cy - 1.1 * r], [cx + 1.1 * r, cy + 1.1 * r], [cx - 1.1 * r, cy + 1.1 * r]]);
    const reticle = (c, op) => {
      let o = `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.68)}" fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="1.3"/>`;
      for (let i = 0; i < 4; i++) o += line(pol(cx, cy, r * 0.68, i * 90), pol(cx, cy, r * 1.05, i * 90), `stroke="${c}" stroke-opacity="${op}" stroke-width="1.3"`);
      return o;
    };
    return `<polygon points="${half}" fill="#050505" fill-opacity=".9"/>${reticle('#000', 0.5)}` +
      `<clipPath id="rr-half"><polygon points="${half}"/></clipPath><g clip-path="url(#rr-half)">${reticle('#ff4048', 0.95)}</g>`;
  },
  // black web over a red top and blue lower body
  'web-slinger': (cx, cy, r) => {
    let s = `<rect x="${f(cx - r)}" y="${f(cy + r * 0.47)}" width="${f(r * 2)}" height="${f(r * 0.65)}" fill="#2a5bd0" fill-opacity=".92"/>`;
    const w = 'stroke="#0a0a0f" stroke-opacity=".6"';
    ring(cx, cy, r, 8).forEach((p) => (s += line([cx, cy], p, w)));
    [0.3, 0.55, 0.8].forEach((k) => (s += `<polygon points="${pts(ring(cx, cy, r * k, 8))}" fill="none" ${w}/>`));
    return s;
  },
  // sling-ring mandala: tick ring, petals, octagram, nested circles
  'mystic-arts': (cx, cy, r) => {
    const cc = (op) => `stroke="#fff1c4" stroke-opacity="${op}" fill="none"`, c = cc(0.6);
    let s = `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.9)}" ${c} stroke-dasharray="1.5 3.5" stroke-width="1.6"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.76)}" ${c}/>`;
    for (let i = 0; i < 24; i++) s += line(pol(cx, cy, r * 0.76, i * 15), pol(cx, cy, r * 0.84, i * 15), c);
    for (let i = 0; i < 8; i++) {
      const a = i * 45, p1 = pol(cx, cy, r * 0.76, a - 14), p2 = pol(cx, cy, r * 0.76, a + 14), tip = pol(cx, cy, r * 0.5, a);
      s += `<path d="M${f(p1[0])},${f(p1[1])} Q${f(tip[0])},${f(tip[1])} ${f(p2[0])},${f(p2[1])}" ${c}/>`;
    }
    const oct = ring(cx, cy, r * 0.76, 8).map((_, i) => pol(cx, cy, r * 0.76, -90 + i * 45));
    s += `<polygon points="${pts([0, 3, 6, 1, 4, 7, 2, 5].map((i) => oct[i]))}" ${cc(0.45)}/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.34)}" ${cc(0.4)} stroke-dasharray="2 3"/>`;
    return s;
  },
  // cosmos dust plus the six stones
  infinity: (cx, cy, r) => {
    let seed = 7, s = '';
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < 16; i++) {
      const a = rnd() * 360, d = r * (0.6 + rnd() * 0.3), [x, y] = pol(cx, cy, d, a);
      s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.7 + rnd() * 0.7)}" fill="#fff" fill-opacity=".6"/>`;
    }
    ['#4a8dff', '#ffd23f', '#ff3b3b', '#b66bff', '#3ddc6b', '#ff9b2f'].forEach((c, i) => {
      const [x, y] = pol(cx, cy, r - 8, -90 + i * 60);
      s += `<circle cx="${f(x)}" cy="${f(y)}" r="3" fill="${c}" stroke="#1a0a30" stroke-opacity=".7" stroke-width=".8"/>`;
    });
    return s;
  },
};

module.exports = { PATTERNS };
