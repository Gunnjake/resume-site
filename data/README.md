# Site Content Data

All site content is driven by JSON files in this folder. Edit these files to update the site without touching HTML.

## Which file controls what

| File | Controls |
|------|----------|
| **site.json** | Name, title, intro, profile image path, resume PDF path, email, LinkedIn, badge (e.g. "Scrum Certified"), **Tech Stack section heading and subheading** (`techStackHeading`, `techStackSubheading`), page subtitles, Explore cards, and which experience/projects are featured on the homepage. |
| **projects.json** | All projects. List and detail content. |
| **experience.json** | All work experiences and "Earlier Work" list. |
| **skills.json** | Homepage skill tiles, skills page categories, and certifications. |
| **techstack.json** | Logos and metadata for the homepage Tech Stack section. |
| **education.json** | Education entries and coursework. |
| **service.json** | Service/volunteer list and detail content (e.g. mission, Eagle Scout). |
| **contact.json** | Contact page cards (email, LinkedIn, résumé CTA). |

---

## How to add a new project

1. Open **data/projects.json**.
2. Add a new object to the `"projects"` array. Use this structure:

```json
{
  "slug": "my-new-project",
  "title": "My New Project",
  "subtitle": "Short tagline",
  "shortDescription": "One or two sentences for the project card.",
  "technologies": ["React", "Node.js"],
  "featured": false,
  "year": "2025",
  "heroImage": "assets/img/projects/my-project/hero.png",
  "heroCaption": "Optional caption.",
  "sections": [
    {
      "title": "Overview",
      "paragraphs": ["First paragraph.", "Second paragraph."]
    },
    {
      "title": "Technologies Used",
      "paragraphs": ["React, Node.js"]
    }
  ]
}
```

3. **Create the detail page:** Copy an existing project HTML file (e.g. **projects/ella-rises.html**) and save it as **projects/my-new-project.html**. The filename must match the `slug` in JSON. The page will load content from **projects.json** automatically.

4. To feature this project on the homepage, add `"my-new-project"` to the `"featuredProjectIds"` array in **site.json**.

---

## How to add a new experience

1. Open **data/experience.json**.
2. Add a new object to the `"experiences"` array. Use this structure:

```json
{
  "slug": "my-role",
  "role": "Job Title",
  "organization": "Company Name",
  "dateRange": "Jan 2025 – Present",
  "location": "City, State",
  "summary": "Optional one-line summary for listing.",
  "technologies": ["FastAPI", "PostgreSQL"],
  "featured": false,
  "logoPath": "assets/img/logos/company.png",
  "logoAlt": "Company Name Logo",
  "sections": [
    {
      "title": "Overview",
      "paragraphs": ["Paragraph one.", "Paragraph two."]
    },
    {
      "title": "Key Responsibilities",
      "list": ["Bullet one.", "Bullet two."]
    }
  ]
}
```

3. **Create the detail page:** Copy **experience/silver-fund.html** and save as **experience/my-role.html** (filename = `slug`). Content loads from **experience.json** automatically.

4. To feature on the homepage, add `"my-role"` to `"featuredExperienceIds"` in **site.json**.

---

## How to feature an item on the homepage

- **site.json** has two arrays:
  - **featuredExperienceIds**: Slugs of experiences to show in "Featured Experience" (first one is used).
  - **featuredProjectIds**: Slugs of projects to show (first two are used for the three-card block: 1 experience + 2 projects).

Order in the arrays controls order on the page.

---

## How detail pages work

- **Project detail:** The URL **projects/ella-rises.html** is a static file. The script reads the filename (e.g. `ella-rises`), fetches **projects.json**, finds the project with `"slug": "ella-rises"`, and renders it into the page. No build step.
- **Experience detail:** Same idea for **experience/silver-fund.html** and **experience.json**.
- **Service detail:** Same for **service/mission.html** and **service/eaglescout.html** using **service.json** and the entry `slug`.

When adding a new project or experience, you must add both the JSON entry and a new HTML file whose name matches the slug (e.g. **projects/new-slug.html**). The HTML file can be a copy of any existing project/experience detail page.

---

## How to update links and resume file

- **Resume path:** In **site.json**, set `"resumePath"` to the path to your PDF (e.g. `"assets/docs/Gunnell, Jake.pdf"`). The nav "Download Résumé" and contact page use this. Replace the PDF file in that folder when you update your résumé.
- **Email / LinkedIn:** In **site.json**, edit `"email"`, `"linkedIn"`, and `"linkedInLabel"`. The contact page and any shared contact UI use these.
- **Profile image:** In **site.json**, set `"profileImage"` (e.g. `"assets/img/Headshot.jpg"`).

---

## Paths in JSON

- Use paths **relative to the site root** (e.g. `assets/img/Headshot.jpg`, `assets/docs/resume.pdf`). The script adds the correct prefix (e.g. `../`) on subpages.

---

## Skills, tech stack, and homepage tiles

- **skills.json** has:
  - **tileSkills**: Array used for summary tiles and for the Skills page content. This does **not** control the homepage Tech Stack logo grid anymore.
  - **categories**: Array of `{ name, meta?, description?, items[] }` for the Skills page.
  - **certifications**: Array of `{ name, meta?, description? }` for the Certifications section.

- **techstack.json** controls the homepage Tech Stack logo grid:
  - File: `data/techstack.json`
  - Structure:

```json
{
  "items": [
    { "name": "Python", "file": "python.svg", "category": "Languages", "order": 1 },
    { "name": "JavaScript", "file": "javascript.svg" }
  ]
}
```

  - **name**: Label shown under the logo.
  - **file**: Filename inside `assets/img/techstack/` (or a full path if you prefer).
  - **category** (optional): For grouping/metadata only; not shown on the homepage.
  - **order** (optional): Lower numbers appear first in the grid.

To add a new Tech Stack logo:

1. Save the SVG or PNG into `assets/img/techstack/` (e.g. `my-tool.svg`).
2. Add an entry to `data/techstack.json`:

```json
{ "name": "My Tool", "file": "my-tool.svg" }
```

3. Reload the homepage — the new logo will appear automatically, with the name rendered under the tile.

Edit these to change the skills page and the homepage tech tiles without touching HTML.
