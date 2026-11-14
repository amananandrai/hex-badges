const { single } = require('../lib/render');

const REPO_RE = /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,38}\/(?!\.{1,2}$)[A-Za-z0-9_.-]{1,100}$/;

function formatCount(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

async function getStars(repo) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'hex-badges' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const r = await fetch(`https://api.github.com/repos/${repo}`, { headers });
  if (r.status === 404) return { error: 'not found' };
  if (r.status === 403 || r.status === 429) return { error: 'rate limited' };
  if (!r.ok) return { error: 'error' };
  const data = await r.json();
  return { stars: data.stargazers_count };
}

module.exports = async (req, res) => {
  const q = req.query || {};
  const repo = q.repo || (q.owner && q.repo_name ? `${q.owner}/${q.repo_name}` : '');
  let svg, maxAge = 3600;

  if (!REPO_RE.test(repo)) {
    svg = single({ label: 'stars', message: 'invalid', color: 'red' });
    maxAge = 60;
  } else {
    try {
      const out = await getStars(repo);
      if (out.error) {
        svg = single({ label: 'stars', message: out.error, color: 'lightgrey' });
        maxAge = 300;
      } else {
        svg = single({ label: 'stars', message: formatCount(out.stars), color: q.color || 'blue' });
      }
    } catch {
      svg = single({ label: 'stars', message: 'error', color: 'lightgrey' });
      maxAge = 60;
    }
  }

  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
  res.setHeader('Cache-Control', `public, max-age=${maxAge}, s-maxage=${maxAge}`);
  res.status(200).send(svg);
};
