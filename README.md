# Portfolio & Resume Site

A static, data-driven portfolio and résumé website. All content is stored in JSON; a single script reads the current URL, loads the right data, and renders the page. No build step, no CMS—just HTML, CSS, and vanilla JavaScript.

## Quick start

- **Run locally:** Open `index.html` in a browser, or use a local static server (e.g. `npx serve .` or Live Server) so that `fetch()` works for the JSON files.
- **Deploy:** The repo is set up for [GitHub Pages](https://pages.github.com/). Push to the `main` branch; the workflow in `.github/workflows/static.yml` deploys the site. Optionally add a custom domain via a `CNAME` file.

## Tech stack

- **HTML** — Static shell pages (one per route or section).
- **CSS** — Single design system in `assets/css/main.css` (with `responsive.css`).
- **JavaScript** — `content.js` (data loading and rendering), `main.js` (reveal animations, tech stack highlight).
- **JSON** — All copy and structure live under `data/`.
- **Hosting** — GitHub Pages (or any static host).

## Project structure

```
├── index.html          # Homepage
├── contact.html        # Contact page
├── education.html      # Education page
├── skills.html         # Skills page
├── experience/         # Experience list + detail pages (e.g. silver-fund.html)
├── projects/           # Projects list + detail pages (e.g. ella-rises.html)
├── service/            # Service list + detail pages
├── data/               # All content (JSON)
│   ├── site.json       # Global: name, intro, resume path, featured IDs, etc.
│   ├── projects.json
│   ├── experience.json
│   ├── skills.json
│   ├── techstack.json  # Homepage tech grid (curated list only)
│   ├── education.json
│   ├── service.json
│   ├── contact.json
│   └── README.md       # Detailed guide: which file controls what, how to add content
├── assets/
│   ├── css/
│   ├── js/
│   ├── img/
│   └── docs/           # e.g. résumé PDF
└── .github/workflows/  # GitHub Pages deploy
```

## How content works

- Each page has a **content root** (e.g. `#content-root`). `content.js` detects the page type from the URL, fetches the needed JSON from `data/`, and injects the rendered HTML.
- **Detail pages** (e.g. `projects/ella-rises.html`, `experience/silver-fund.html`) use the filename as the **slug**; the script finds the matching entry in the corresponding JSON and renders it. To add a new project or experience, add the entry to the JSON and add a new HTML file whose name matches the slug (you can copy an existing one).
- **Homepage:** Renders hero + tech stack (from `site.json` + `techstack.json`) and featured experience/projects (from `site.json` featured IDs + `experience.json` + `projects.json`).

For full details—which file controls what, how to add a project or experience, how to feature items on the homepage, and how the tech stack grid is configured—see **[data/README.md](data/README.md)**.

## Customization

- **Resume, email, LinkedIn, profile image:** Edit `data/site.json`.
- **Homepage featured experience/projects:** Edit `featuredExperienceIds` and `featuredProjectIds` in `data/site.json`.
- **Tech stack icons on homepage:** Edit `data/techstack.json` and add SVGs under `assets/img/techstack/` as needed. Only entries in that file are shown; there is no automatic folder scanning.
- **Theme and layout:** `assets/css/main.css` (dark theme, typography, and layout are all in there).

## License

Private/portfolio use. Replace or remove this section as you prefer.
