# hex-badges

Hexagonal badges on Vercel. Two styles: `wide` (default) and `single`.

    /api/badge?style=wide&label=build&message=passing&color=brightgreen
    /api/badge?style=single&label=stars&message=12.4k&color=blue
    /badge/wide/build/passing/brightgreen        (path form)

Params: style, label, message, color, labelColor (wide only). Colors: names or hex.

Deploy: `npm i -g vercel && vercel`

## GitHub badges

    /github/<metric>/<owner>/<repo>
    /github/stars/facebook/react
    /github/last-commit/facebook/react?style=wide

| Metric | Shows |
|---|---|
| stars, forks, watchers | counts |
| issues, prs | open issues / open pull requests |
| release | latest release (falls back to latest tag) |
| tag | latest tag |
| last-commit | relative time, optional `branch` |
| license | SPDX id |
| contributors | count (includes anonymous) |
| language | primary language |
| size | repository size |

Params: `style` (`single` default, or `wide`), `label`, `color`, `labelColor` (wide only).
Set `GITHUB_TOKEN` in Vercel env vars to avoid the 60 req/hour unauthenticated limit.
