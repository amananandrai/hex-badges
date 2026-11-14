const { wide, single } = require('../lib/render');
const { METRICS, REPO_RE, BadgeError } = require('../lib/github');

const clip = (v) => String(v).slice(0, 40);

module.exports = async (req, res) => {
  const q = req.query || {};
  const render = q.style === 'wide' ? wide : single;
  const metric = METRICS[q.metric];
  const label = q.label ? clip(q.label) : metric ? metric.label : 'github';
  let opts, maxAge = 3600;

  if (!metric) {
    opts = { label, message: 'unknown metric', color: 'red' };
    maxAge = 60;
  } else if (!REPO_RE.test(q.repo || '')) {
    opts = { label, message: 'invalid repo', color: 'red' };
    maxAge = 60;
  } else {
    try {
      const out = await metric.get(q.repo, q);
      opts = { label, message: out.message, color: q.color || out.color || 'blue', labelColor: q.labelColor };
      if (q.metric === 'last-commit') maxAge = 300;
    } catch (e) {
      const msg = e instanceof BadgeError ? e.message : 'error';
      opts = { label, message: msg, color: 'lightgrey' };
      maxAge = msg === 'not found' ? 300 : 60;
    }
  }

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge}`);
  res.status(200).send(render(opts));
};
