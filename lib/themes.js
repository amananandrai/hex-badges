// msg / lab: [top, bottom] gradient stops. fg: text colors. stroke: outline. glow: halo color (single style).
const THEMES = {
  'stark-forge':  { title: 'Stark Forge',    note: 'red + gold',        msg: ['#e8402f', '#8f1010'], lab: ['#f8dc82', '#c4901a'], msgFg: '#ffe9a8', labFg: '#4a1a00', stroke: '#f2c94c', glow: '#ff6a2b' },
  'latveria':     { title: 'Latveria',       note: 'green + silver',    msg: ['#2fa85c', '#115228'], lab: ['#e3e8ed', '#8d96a0'], msgFg: '#eaffee', labFg: '#16261c', stroke: '#c9d0d8', glow: '#37ff86' },
  'asgard':       { title: 'Asgard',         note: 'red + silver',      msg: ['#d92b3d', '#7c0e1c'], lab: ['#eef1f4', '#98a1ab'], msgFg: '#ffffff', labFg: '#20242a', stroke: '#d6dce3', glow: '#7cc8ff' },
  'wakanda':      { title: 'Wakanda',        note: 'black + purple',    msg: ['#8a35e0', '#3b136e'], lab: ['#24242d', '#07070a'], msgFg: '#ffffff', labFg: '#d2b0ff', stroke: '#b78cff', glow: '#a855f7' },
  'star-shield':  { title: 'Star Shield',    note: 'blue + red + white',msg: ['#2f63c4', '#112b60'], lab: ['#d9303f', '#850f1c'], msgFg: '#ffffff', labFg: '#ffffff', stroke: '#f5f7fa', glow: '#8ab8ff' },
  'gamma':        { title: 'Gamma Smash',    note: 'green + purple',    msg: ['#52c94d', '#1b7424'], lab: ['#7f40c0', '#3f1d69'], msgFg: '#f0ffe9', labFg: '#f0ddff', stroke: '#a4ec86', glow: '#5dff4d' },
  'red-room':     { title: 'Red Room',       note: 'black + red',       msg: ['#e8202c', '#7f0a12'], lab: ['#1c1c1c', '#040404'], msgFg: '#ffffff', labFg: '#ff7b7b', stroke: '#ff4048', glow: '#ff1f2d' },
  'web-slinger':  { title: 'Web Slinger',    note: 'red + blue',        msg: ['#e5303a', '#951017'], lab: ['#2f63d6', '#12297a'], msgFg: '#ffffff', labFg: '#ffffff', stroke: '#d3dbe8', glow: '#ff3340' },
  'mystic-arts':  { title: 'Mystic Arts',    note: 'amber + crimson',   msg: ['#f7ac2b', '#c0650a'], lab: ['#a8192c', '#580a16'], msgFg: '#3a1600', labFg: '#ffd9a0', stroke: '#ffd47e', glow: '#ffa51f' },
  'infinity':     { title: 'Infinity',       note: 'purple + gold',     msg: ['#8444c9', '#3a1870'], lab: ['#f8c94b', '#b5830b'], msgFg: '#fff1c2', labFg: '#3b2300', stroke: '#f6c445', glow: '#b86cff' },
};

const hasTheme = (k) => typeof k === 'string' && Object.prototype.hasOwnProperty.call(THEMES, k);

module.exports = { THEMES, hasTheme };
