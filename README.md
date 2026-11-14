# hex-badges

Hexagonal badges on Vercel. Two styles: `wide` (default) and `single`.

    /api/badge?style=wide&label=build&message=passing&color=brightgreen
    /api/badge?style=single&label=stars&message=12.4k&color=blue
    /badge/wide/build/passing/brightgreen        (path form)

Params: style, label, message, color, labelColor (wide only). Colors: names or hex.

Deploy: `npm i -g vercel && vercel`

## GitHub stars (single hexagon)

    /api/github-stars?repo=facebook/react
    /github/stars/facebook/react          (path form)

Optional `color` param. Set `GITHUB_TOKEN` in Vercel env vars to avoid the 60 req/hour unauthenticated limit.
