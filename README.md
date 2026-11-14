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

## Prompts for future changes

Copy, adjust the details and paste any of these.

**Content**
- "Add a new job at `<company>` as `<role>` from `<date>` to `<date>` with these highlights: … Update the timeline, journey map and stats."
- "Add a Projects section with 3 cards (title, description, tech stack, GitHub link, live link)."
- "Add a Certifications section with these items: …"
- "Add a Blog / Articles section linking to my posts: …"

**Design**
- "Change the accent colors to `<colors>` and keep contrast accessible."
- "Make the hero photo square with rounded corners instead of circular."
- "Add a subtle noise/grain texture and a sticky side navigation dot indicator."
- "Replace the skills orbit with a radar chart."

**Features**
- "Add a working contact form using Formspree (endpoint: …) with validation and success message."
- "Add a downloadable resume button that tracks clicks with Google Analytics."
- "Add Google Analytics / Plausible tracking."
- "Add a language or theme switcher with more than two themes."
- "Add a testimonials carousel using these quotes: …"

**Performance, SEO and quality**
- "Optimize for Lighthouse 95+: lazy-load images, add `width`/`height`, preload fonts, minify CSS and JS."
- "Add SEO: Open Graph image, Twitter cards, JSON-LD Person schema, sitemap.xml and robots.txt."
- "Run an accessibility audit against WCAG 2.2 AA and fix every issue."
- "Add a custom 404 page and a favicon set."

**Deployment**
- "Give me step-by-step instructions to deploy this to GitHub Pages with a custom domain."
- "Add a GitHub Actions workflow that deploys to GitHub Pages on every push."

**Tip:** be specific. Name the file or section, describe the result you want, and include any exact text, links or numbers to use.
