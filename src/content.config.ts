import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    name: z.string(),
    photo: z.string(),
    photoAlt: z.string(),
    area: z.string(),
    category: z.string(),
    pullQuote: z.string(),
    publishDate: z.coerce.date(),
    contributedBy: z.string(),
    status: z.enum(['draft', 'published']),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { stories };
