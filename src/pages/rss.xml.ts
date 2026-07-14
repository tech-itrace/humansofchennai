import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const stories = (await getCollection('stories', ({ data }) => data.status === 'published')).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );

  return rss({
    title: 'Humans of Chennai',
    description: 'Short, first-person stories about people across Chennai.',
    // context.site alone omits the GitHub Pages base path; the channel's
    // own <link> needs to point at the actual site root, not the origin.
    site: new URL(import.meta.env.BASE_URL, context.site).toString(),
    items: stories.map((story) => ({
      title: story.data.name,
      description: story.data.pullQuote,
      pubDate: story.data.publishDate,
      // @astrojs/rss resolves `link` against `site` only, not `base`, so the
      // base path has to be included here explicitly.
      link: `${import.meta.env.BASE_URL}stories/${story.id}/`,
    })),
  });
}
