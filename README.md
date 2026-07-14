# Humans of Chennai

A static blog of short, first-person stories about people across Chennai —
one subject, one portrait, one narrative per post. See [PLAN.md](PLAN.md)
for the full project plan and design rationale.

## Project structure

```text
/
├── public/
│   └── images/stories/<slug>/    # per-story portrait images
├── src/
│   ├── content/stories/*.md      # one story per file (see schema below)
│   ├── content.config.ts         # frontmatter schema (Zod)
│   ├── components/                # Header, Footer, StoryCard
│   ├── layouts/BaseLayout.astro
│   └── pages/
│       ├── index.astro           # homepage story grid
│       ├── about.astro
│       └── stories/[id]/index.astro
└── package.json
```

## Adding a story

Create `src/content/stories/<slug>.md`:

```md
---
name: "Priya"
photo: images/stories/<slug>/cover.jpg
photoAlt: "Short description of the photo"
area: "Triplicane"          # Chennai neighborhood
category: "Work"            # Work, Family, Craft, Migration, etc.
pullQuote: "A short line pulled from the story."
publishDate: 2026-01-10
contributedBy: "Your name"
status: draft | published   # draft stories don't appear on the site
tags: [work, craft]
---

Story body in Markdown, first person.
```

Place the portrait at `public/images/stories/<slug>/cover.jpg`. A story
only appears on the site once `status: published`.

## Deployment

Pushes to `main` build and deploy automatically via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

One-time setup (repo admin, via the GitHub web UI): go to
**Settings → Pages** and set **Source** to **GitHub Actions**. Until that's
set, the workflow will build successfully but the deploy step will fail.

The site is configured in `astro.config.mjs` for
`https://tech-itrace.github.io/humansofchennai/`. If a custom domain is
added later, update `site` and remove `base` there, and add a `CNAME` file
under `public/`.

## Commands

| Command           | Action                                       |
| :----------------- | :-------------------------------------------- |
| `npm install`       | Install dependencies                          |
| `npm run dev`       | Start local dev server at `localhost:4321`    |
| `npm run build`     | Build the production site to `./dist/`        |
| `npm run preview`   | Preview the build locally before deploying    |
