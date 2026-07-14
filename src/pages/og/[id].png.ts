import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '../../lib/ogImage';

export const getStaticPaths: GetStaticPaths = async () => {
  const stories = await getCollection('stories', ({ data }) => data.status === 'published');
  return stories.map((story) => ({ params: { id: story.id }, props: { story } }));
};

export const GET: APIRoute = async ({ props }) => {
  const { story } = props;
  const png = await generateOgImage({
    name: story.data.name,
    pullQuote: story.data.pullQuote,
    photoPath: story.data.photo,
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
