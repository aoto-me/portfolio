import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const robots = (): MetadataRoute.Robots => {
  const url = process.env.NEXT_PUBLIC_URL;

  return {
    rules: {
      disallow: '/',
      userAgent: '*',
    },
    sitemap: `${url}/sitemap.xml`,
  };
};

export default robots;
