# Humans of PSG — Project Plan

## 1. Purpose

A maintainable static blog that publishes short, first-person human-interest
stories about people at PSG College of Technology (students, staff, alumni),
in the editorial style of Humans of Bombay — one subject, one portrait, one
narrative per post — rather than the multi-category magazine style of PSG's
existing publication, The Bridge.

## 2. Reference sites analyzed

### thebridge.psgtech.ac.in ("The Bridge")
- Ghost-CMS-powered official PSG Tech magazine.
- Category-driven navigation (Careers, Interviews, Sci Tech, Entrepreneurship, ...).
- Homepage is a grid of featured cards: avatar, category tag, title, "time ago • read time".
- Individual posts use a two-column hero (portrait left, colored panel with
  title/subtitle/byline right), followed by long-form Q&A interview text,
  author bio, "Recommended for you" related posts, and a newsletter CTA.
- Good reference for: card grid layout, tag/category browsing, related-posts pattern.
- Not the right content shape for this project: it's interview/Q&A and multi-topic,
  not single-subject narrative.

### humansofbombay.in ("Humans of Bombay")
- Storytelling platform, not a magazine. Minimal chrome.
- Blog grid of story cards: photo + title + short excerpt + "Read More".
- Story page: one large portrait (often black-and-white), then a first-person
  narrative with no Q&A structure and minimal byline emphasis, a short closing
  "brand" paragraph, a "Recent posts" sidebar, and social share icons.
- Content is short, emotional, one-subject-per-post.
- This is the content/UX model "Humans of PSG" should follow.

## 3. Content model

One Markdown file per story, with frontmatter validated at build time so a
missing photo or name fails the build instead of shipping broken.

```
src/content/stories/riza-and-her-sister.md
---
name: "Riza"
slug: riza-and-her-sister
photo: /images/stories/riza-and-her-sister/cover.jpg
photoAlt: "Riza and her sister"
department: "Alumni"        # e.g. Mechanical, CSE, Textile, Staff, Alumni
batch: "2019"                # optional
pullQuote: "What makes her special is everything but her condition."
publishDate: 2026-07-15
contributedBy: "Jane Doe"
status: draft | published
tags: [family, resilience]
---
Story body in first person, Markdown...
```

A Zod schema in `src/content.config.ts` enforces this shape.

## 4. Tech stack

- **Astro** — content collections for stories, plain `.astro` components for
  layout. No client-side JS framework needed; this is 100% static content.
- **Homepage** — grid of story cards (photo, name, pull-quote, "Read story"),
  following the Humans of Bombay blog-grid pattern.
- **Story page** — full-bleed portrait, then narrative text, then a "More
  stories" rail, restyled with PSG colors/typeface.
- **Tag/department pages** (e.g. `/tag/alumni`) generated automatically from
  frontmatter, for browsing by department without adopting The Bridge's full
  magazine chrome.

## 5. Authoring workflow (non-technical contributors)

- **Decap CMS** at `/admin`, configured against the same `stories` collection
  schema as the Zod schema, so the CMS form and validation never drift apart.
- **Editorial workflow mode** — a contributor's submission becomes a draft PR
  (`status: draft`); it's reviewed on GitHub (photo + text diff) before merge
  to `main` publishes it. No direct-to-main writes from volunteers.
- **Auth caveat** — GitHub Pages serves static files only, so Decap's
  GitHub-backend login needs a small OAuth proxy. Deploy the standard
  `decap-cms-oauth-provider` as a free Cloudflare Worker or Vercel function.
  This is the one non-static piece of the project, and it only handles login,
  not content storage (content still lives in the git repo).

## 6. Build & deploy

- GitHub Actions: on push to `main`, run `astro build`, deploy via
  `actions/deploy-pages` to GitHub Pages.
- Image handling via Astro's built-in `<Image>` component for automatic
  resizing/optimization, since contributor photos will vary widely in size.
- Auto-generated sitemap and a per-story OG image (name + pull-quote over the
  portrait) so shared links render well on WhatsApp/Instagram.

## 7. Phasing

1. Scaffold the Astro project, content schema, homepage grid, and story page
   templates. Seed with 3–5 real stories written directly as Markdown.
2. Wire up GitHub Actions deploy to GitHub Pages.
3. Add Decap CMS, the OAuth proxy, and the editorial workflow for volunteer
   contributions.
4. Polish: tag pages, RSS feed, OG image generation, and a CONTRIBUTING.md
   documenting both the git route and the `/admin` route for contributors.

## 8. Open items / decisions deferred

- Final visual design (PSG brand colors/typeface) not yet chosen.
- Whether a custom domain will be used for GitHub Pages.
- Moderation policy for volunteer-submitted stories beyond "reviewed via PR".
