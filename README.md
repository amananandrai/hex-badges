# hex-badges

Hexagonal badges on Vercel. Two styles: `wide` (default) and `single`.

    /api/badge?style=wide&label=build&message=passing&color=brightgreen
    /api/badge?style=single&label=stars&message=12.4k&color=blue
    /badge/wide/build/passing/brightgreen        (path form)

Params: style, label, message, color, labelColor (wide only). Colors: names or hex.

Deploy: `npm i -g vercel && vercel`

## Preview

![All themes](docs/themes.png)

### Live examples

| Theme | Single hexagon | Elongated |
|---|---|---|
| **Stark Forge**<br>red + gold<br>`theme=stark-forge` | ![Stark Forge](https://hex-badges.vercel.app/api/badge?style=single&label=stars&message=12.4k&theme=stark-forge) | ![Stark Forge](https://hex-badges.vercel.app/api/badge?style=wide&label=stars&message=12.4k&theme=stark-forge) |
| **Latveria**<br>green + silver<br>`theme=latveria` | ![Latveria](https://hex-badges.vercel.app/api/badge?style=single&label=forks&message=980&theme=latveria) | ![Latveria](https://hex-badges.vercel.app/api/badge?style=wide&label=forks&message=980&theme=latveria) |
| **Asgard**<br>red + silver<br>`theme=asgard` | ![Asgard](https://hex-badges.vercel.app/api/badge?style=single&label=license&message=MIT&theme=asgard) | ![Asgard](https://hex-badges.vercel.app/api/badge?style=wide&label=license&message=MIT&theme=asgard) |
| **Wakanda**<br>black + purple<br>`theme=wakanda` | ![Wakanda](https://hex-badges.vercel.app/api/badge?style=single&label=release&message=v2.1.0&theme=wakanda) | ![Wakanda](https://hex-badges.vercel.app/api/badge?style=wide&label=release&message=v2.1.0&theme=wakanda) |
| **Star Shield**<br>blue + red + white<br>`theme=star-shield` | ![Star Shield](https://hex-badges.vercel.app/api/badge?style=single&label=issues&message=42&theme=star-shield) | ![Star Shield](https://hex-badges.vercel.app/api/badge?style=wide&label=issues&message=42&theme=star-shield) |
| **Gamma Smash**<br>green + purple<br>`theme=gamma` | ![Gamma Smash](https://hex-badges.vercel.app/api/badge?style=single&label=size&message=2.0%20MB&theme=gamma) | ![Gamma Smash](https://hex-badges.vercel.app/api/badge?style=wide&label=size&message=2.0%20MB&theme=gamma) |
| **Red Room**<br>black + red<br>`theme=red-room` | ![Red Room](https://hex-badges.vercel.app/api/badge?style=single&label=commit&message=3%20days%20ago&theme=red-room) | ![Red Room](https://hex-badges.vercel.app/api/badge?style=wide&label=commit&message=3%20days%20ago&theme=red-room) |
| **Web Slinger**<br>red + blue + black<br>`theme=web-slinger` | ![Web Slinger](https://hex-badges.vercel.app/api/badge?style=single&label=PRs&message=7&theme=web-slinger) | ![Web Slinger](https://hex-badges.vercel.app/api/badge?style=wide&label=PRs&message=7&theme=web-slinger) |
| **Mystic Arts**<br>amber + crimson<br>`theme=mystic-arts` | ![Mystic Arts](https://hex-badges.vercel.app/api/badge?style=single&label=language&message=Python&theme=mystic-arts) | ![Mystic Arts](https://hex-badges.vercel.app/api/badge?style=wide&label=language&message=Python&theme=mystic-arts) |
| **Infinity**<br>purple + gold<br>`theme=infinity` | ![Infinity](https://hex-badges.vercel.app/api/badge?style=single&label=contributors&message=1.2k&theme=infinity) | ![Infinity](https://hex-badges.vercel.app/api/badge?style=wide&label=contributors&message=1.2k&theme=infinity) |

Use any of them with your own data, for example:

    ![stars](https://hex-badges.vercel.app/github/stars/<owner>/<repo>?theme=infinity)
    ![license](https://hex-badges.vercel.app/github/license/<owner>/<repo>?theme=asgard&style=wide)

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

## Avengers themes

Add `?theme=<name>` to any badge. Single hexagons get a glow and a themed pattern; use `?pattern=none` to turn the pattern off.

| Theme | Colors | Single-hex pattern |
|---|---|---|
| stark-forge | red + gold | arc-reactor rings |
| latveria | green + silver | armor plates + rivets |
| asgard | red + silver | lightning |
| wakanda | black + purple | woven lattice |
| star-shield | blue + red + white | stars + stripes |
| gamma | green + purple | cracks |
| red-room | black + red | reticle + split |
| web-slinger | red + blue + black | spider web |
| mystic-arts | amber + crimson | sling-ring mandala |
| infinity | purple + gold | cosmos + stones |

    /github/stars/facebook/react?theme=stark-forge
    /github/stars/facebook/react?theme=web-slinger&style=wide

The glow looks best on dark backgrounds. Preview sheet: `node scripts/patterns-sheet.js out.svg`.

## Landing page

`public/index.html` is served at `/`: a badge builder with copy buttons and a gallery of all themes.
