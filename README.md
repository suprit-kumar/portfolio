# Suprit Mohanta — Portfolio

A premium, dark-themed personal portfolio built with **HTML5, CSS3 and vanilla JavaScript** only. No frameworks, no build step, no backend.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and all content |
| `style.css` | Design system, layout, animations, responsive rules |
| `script.js` | Interactions: typing, particles, tilt, scroll effects, journey map |
| `profile-photo.jpg` | **You add this** — hero portrait (falls back to "SM" initials if missing) |
| `Suprit-Mohanta-Resume.pdf` | **You add this** — target of the Download Resume buttons |

## Run locally

Open `index.html` in a browser, or serve the folder:

```powershell
python -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy

Upload the folder to any static host: GitHub Pages, Netlify, Vercel, Azure Static Web Apps or Cloudflare Pages.

## Sections

Hero · About · Experience timeline · Achievements · Skills (orbit + filters + bars) · Tech Impact · Philosophy · Career Journey map · Education · Domains · Contact · Footer

## Features

- Dark theme by default with a light/dark toggle (saved in `localStorage`)
- Animated neural-network hero background and particles around the photo
- Typing effect, text reveals, count-up stats, SVG path animations
- Card tilt, cursor glow, magnetic buttons, scroll progress bar, smooth scrolling
- Interactive career journey map and skill category filters
- Accessible: semantic HTML, skip link, focus styles, `prefers-reduced-motion` support
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (labels)

## Common edits

| What | Where |
| --- | --- |
| Email, LinkedIn, GitHub | `index.html` — search `supritk16` / `suprit-kumar` (hero socials and contact section) |
| Typing phrases | `script.js` — `phrases` array |
| Stats numbers | `index.html` — `data-count="…"` attributes |
| Skill bar lengths | `index.html` — `data-v="…"` on each `.meter` |
| Journey map details | `script.js` — `data` array in the "Career journey map" block |
| Colors and fonts | `style.css` — `:root` variables (`--a1`, `--a2`, `--a3`, `--font`, `--display`, `--mono`) |

