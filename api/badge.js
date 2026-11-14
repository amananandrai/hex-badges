const { wide, single } = require('../lib/render');

const clip = (v, d) => String(v ?? d).slice(0, 40);

module.exports = (req, res) => {
  const q = req.query || {};
  const opts = {
    label: clip(q.label, 'label'),
    message: clip(q.message, 'message'),
    color: q.color,
    labelColor: q.labelColor,
  };
  const svg = q.style === 'single' ? single(opts) : wide(opts);
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.status(200).send(svg);
};
