import { getPostsForLlms } from '../_libs';

export const dynamic = 'force-static';

export const GET = async (): Promise<Response> => {
  const siteUrl = process.env.NEXT_PUBLIC_URL;
  const posts = await getPostsForLlms();

  const worksList = posts
    .map(post => {
      const tech = [...post.language, ...post.tool].join('、');
      const text = post.text.replaceAll(/\r?\n/g, ' ');
      const detail = [
        `担当: ${post.part.join('、')}`,
        `プロジェクトの種類: ${post.category.join('、')}`,
        `サイトの形態: ${post.siteType}`,
        tech && `技術: ${tech}`,
        `制作年度: ${post.year}`,
        `[公開サイト](${post.url})`,
      ]
        .filter(Boolean)
        .join(' | ');

      return `- [${post.title}](${siteUrl}/works/${post.id}): ${text}\n  ${detail}`;
    })
    .join('\n');

  const body = `# Portfolio - AotoMegumi

> アオトメグミのポートフォリオサイトです。自主制作・受託制作で作成したWebサイトの制作実績を掲載しています。

Webデザイナーのアオトメグミによる、自主制作・受託制作のWebサイト制作実績一覧です。各実績には担当領域・使用技術・制作年度を記載しており、詳細は各リンク先のページで確認できます。

## Works

${worksList}

## Optional

- [Sitemap](${siteUrl}/sitemap.xml): サイト全体のページ一覧
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
