const REPO_RE = /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,38}\/(?!\.{1,2}$)[A-Za-z0-9_.-]{1,100}$/;
const BRANCH_RE = /^[A-Za-z0-9_][A-Za-z0-9_./-]{0,99}$/;

class BadgeError extends Error {}

function formatCount(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

function formatSize(kb) {
  if (kb >= 1024 * 1024) return (kb / 1024 / 1024).toFixed(1) + ' GB';
  if (kb >= 1024) return (kb / 1024).toFixed(1) + ' MB';
  return kb + ' KB';
}

function ago(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const units = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [name, secs] of units) {
    if (s >= secs) {
      const n = Math.floor(s / secs);
      return `${n} ${name}${n > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

async function gh(path) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'hex-badges' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const r = await fetch(`https://api.github.com${path}`, { headers });
  if (r.status === 404) throw new BadgeError('not found');
  if (r.status === 403 || r.status === 429) throw new BadgeError('rate limited');
  if (r.status === 409) throw new BadgeError('empty repo');
  if (!r.ok) throw new BadgeError('error');
  return r;
}

async function lastPage(path) {
  const r = await gh(`${path}${path.includes('?') ? '&' : '?'}per_page=1`);
  const link = r.headers.get('link') || '';
  const m = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
  if (m) return Number(m[1]);
  const body = await r.json();
  return Array.isArray(body) ? body.length : 0;
}

const repoInfo = (repo) => gh(`/repos/${repo}`).then((r) => r.json());
const searchCount = (repo, kind) =>
  gh(`/search/issues?q=repo:${repo}+is:${kind}+is:open&per_page=1`).then((r) => r.json()).then((d) => d.total_count);

const METRICS = {
  stars: { label: 'stars', get: async (repo) => ({ message: formatCount((await repoInfo(repo)).stargazers_count) }) },
  forks: { label: 'forks', get: async (repo) => ({ message: formatCount((await repoInfo(repo)).forks_count) }) },
  watchers: { label: 'watchers', get: async (repo) => ({ message: formatCount((await repoInfo(repo)).subscribers_count) }) },
  issues: { label: 'issues', get: async (repo) => ({ message: formatCount(await searchCount(repo, 'issue')) }) },
  prs: { label: 'PRs', get: async (repo) => ({ message: formatCount(await searchCount(repo, 'pr')) }) },
  release: {
    label: 'release',
    get: async (repo) => {
      try {
        const rel = await gh(`/repos/${repo}/releases/latest`).then((r) => r.json());
        return { message: rel.tag_name };
      } catch (e) {
        if (!(e instanceof BadgeError) || e.message !== 'not found') throw e;
        const tags = await gh(`/repos/${repo}/tags?per_page=1`).then((r) => r.json());
        return { message: tags[0] ? tags[0].name : 'none', color: 'lightgrey' };
      }
    },
  },
  tag: {
    label: 'tag',
    get: async (repo) => {
      const tags = await gh(`/repos/${repo}/tags?per_page=1`).then((r) => r.json());
      return { message: tags[0] ? tags[0].name : 'none', color: tags[0] ? undefined : 'lightgrey' };
    },
  },
  'last-commit': {
    label: 'commit',
    get: async (repo, q) => {
      const branch = q.branch && BRANCH_RE.test(q.branch) ? `&sha=${encodeURIComponent(q.branch)}` : '';
      const list = await gh(`/repos/${repo}/commits?per_page=1${branch}`).then((r) => r.json());
      if (!list[0]) return { message: 'none', color: 'lightgrey' };
      return { message: ago(list[0].commit.committer.date) };
    },
  },
  license: {
    label: 'license',
    get: async (repo) => {
      const lic = (await repoInfo(repo)).license;
      if (!lic) return { message: 'none', color: 'lightgrey' };
      return { message: lic.spdx_id && lic.spdx_id !== 'NOASSERTION' ? lic.spdx_id : lic.name, color: 'green' };
    },
  },
  contributors: { label: 'contributors', get: async (repo) => ({ message: formatCount(await lastPage(`/repos/${repo}/contributors?anon=1`)) }) },
  language: {
    label: 'language',
    get: async (repo) => {
      const lang = (await repoInfo(repo)).language;
      return lang ? { message: lang } : { message: 'none', color: 'lightgrey' };
    },
  },
  size: { label: 'size', get: async (repo) => ({ message: formatSize((await repoInfo(repo)).size) }) },
};

module.exports = { METRICS, REPO_RE, BadgeError, formatCount, formatSize, ago };
