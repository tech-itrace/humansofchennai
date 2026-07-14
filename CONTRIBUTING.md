# Contributing a story

## Option A: the `/admin` editor (no git required)

Go to `/admin` on the live site and log in with GitHub. Fill in the form
and save — this opens a pull request with your story rather than publishing
it directly. A maintainer reviews the photo and text, then merges it, which
publishes it to the site.

(This requires the CMS OAuth proxy to be deployed — see
[oauth-proxy/README.md](oauth-proxy/README.md) if `/admin` isn't working yet.
Also note: `npm run dev` / `npm run preview` don't auto-resolve `/admin/` to
its `index.html` locally — use `/admin/index.html` when testing on your
machine. GitHub Pages does resolve directory URLs to `index.html` normally,
so plain `/admin/` works on the live site.)

## Option B: git, for anyone comfortable with a PR

1. Add `public/images/stories/<slug>/cover.jpg` (the portrait).
2. Add `src/content/stories/<slug>.md` — see the frontmatter schema and
   example in [README.md](README.md#adding-a-story).
3. Open a pull request. Set `status: draft` until it's ready to publish, so
   it doesn't accidentally build live before review.

## Editorial notes

- One subject, one photo, one story per post — first person, in the
  subject's own words where possible.
- A story only appears on the site once `status: published` **and** merged
  to `main`.
- Get the subject's explicit permission before publishing their photo and
  story.
