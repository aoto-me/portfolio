import { Copyright, PageTransition } from '@/app/_components/common';
import {
  Accordion,
  ArticleHeader,
  CaseBlock,
  DecorativeBorder,
  DetailSection,
  DlItem,
  Header,
  Nav,
  SaveIndex,
  TableWcag,
} from '@/app/_components/works';
import { getPostById, getPostsNav } from '@/app/_libs';
import { client } from '@/app/_libs/microcms';
import clsx from 'clsx';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { type BreadcrumbList, type CreativeWork, type WithContext } from 'schema-dts';
import styles from './page.module.scss';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const { id } = await params;
  const post = await getPostById(id).catch(notFound);
  const url = `${baseUrl}/works/${post.id}`;

  return {
    alternates: {
      canonical: url,
    },
    description: post.text,
    openGraph: {
      description: post.text,
      images: ['/ogp.jpg'],
      locale: 'ja_JP',
      siteName: 'Portfolio - AotoMegumi',
      title: post.title,
      type: 'article',
      url: url,
    },
    title: post.title,
  };
};

export const generateStaticParams = async () => {
  const contentIds = await client.getAllContentIds({ endpoint: 'works' });

  return contentIds.map(contentId => ({
    id: contentId,
  }));
};

const PostPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const works = await getPostById(id).catch(notFound);
  const allPosts = await getPostsNav();
  const url = process.env.NEXT_PUBLIC_URL;

  const index = allPosts.findIndex(p => p.id === id);
  const next = allPosts[(index + 1) % allPosts.length];
  const prev = allPosts[(index - 1 + allPosts.length) % allPosts.length];

  const jsonLd: WithContext<CreativeWork> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    author: {
      '@type': 'Person',
      name: 'AotoMegumi',
    },
    dateModified: works.updatedAt,
    description: works.text,
    genre: 'Web design',
    inLanguage: 'ja',
    keywords: [works.siteType],
    name: works.title,
    thumbnailUrl: works.thumbnail.url,
    url: `${url}/works/${works.id}`,
  };

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem' as const,
        item: `${url}/`,
        name: 'Portfolio - AotoMegumi',
        position: 1,
      },
      {
        '@type': 'ListItem' as const,
        item: `${url}/works/${works.id}`,
        name: works.title,
        position: 2,
      },
    ],
  };

  return (
    <PageTransition name="post-transition">
      <div className={`${styles.page} page`} data-page="works">
        <div className={`${styles.page__inner} postFadeIn page__inner`}>
          <SaveIndex index={index} />
          <div className={clsx(styles.frame, styles['frame--left-top'])}></div>
          <div className={clsx(styles.frame, styles['frame--left-bottom'])}></div>
          <div className={clsx(styles.frame, styles['frame--right-top'])}></div>
          <div className={clsx(styles.frame, styles['frame--right-bottom'])}></div>
          <Header />
          <main>
            <article className={styles.article}>
              <ArticleHeader category={works.category[0]} index={index} siteType={works.siteType} title={works.title} />

              <div className={styles.summary}>
                <h2 className="u-screenReader">サイト概要</h2>
                <div>
                  <dl className={styles.summary__dl}>
                    <DlItem items={works.part} label="担当" />

                    <div>
                      <dt>URL</dt>
                      <dd>
                        <a href={works.url} rel="noopener noreferrer" target="_blank">
                          {works.url}
                          <span className="u-screenReader">（新しいウィンドウで開く）</span>
                        </a>
                        {works.id === 'schedule-app' && (
                          <dl aria-label="テスト用アカウント">
                            <div>
                              <dt>UserName</dt>
                              <dd>test</dd>
                            </div>
                            <div>
                              <dt>Password</dt>
                              <dd>test1234</dd>
                            </div>
                          </dl>
                        )}
                      </dd>
                    </div>

                    {works.github && (
                      <div>
                        <dt>GitHub</dt>
                        <dd>
                          <a href={works.github} rel="noopener noreferrer" target="_blank">
                            {works.github}
                            <span className="u-screenReader">（新しいウィンドウで開く）</span>
                          </a>
                        </dd>
                      </div>
                    )}

                    <div>
                      <dt>制作年度</dt>
                      <dd>{works.year}</dd>
                    </div>

                    <DlItem items={works.cms} label="CMS" />
                    <DlItem items={works.db} label="DB" />
                    <DlItem items={works.language} label="言語・開発環境" />
                    <DlItem items={works.tool} label="アプリケーション" />
                  </dl>
                  <p className={styles.summary__text}>{works.text}</p>
                </div>
                <div className={styles.summary__img}>
                  <Image
                    alt=""
                    height={works.frontImage.height}
                    loading={'eager'}
                    src={works.frontImage.url}
                    width={works.frontImage.width}
                  />
                </div>
              </div>

              {works.problem && works.solution && (
                <CaseBlock
                  screenReaderTitle="サイトの課題と解決"
                  sections={[
                    { heading: '課題', text: works.problem },
                    { heading: '解決', text: works.solution },
                  ]}
                />
              )}

              {(works.id === 'portfolio' || works.id === 'schedule-app') && (
                <CaseBlock
                  screenReaderTitle="サイト制作にあたっての目標"
                  sections={[{ heading: '目標', text: works.solution }]}
                />
              )}

              <DecorativeBorder />

              {works.siteImage.map((image, i) => {
                return (
                  <Image
                    alt={image.alt}
                    className={styles.siteImage}
                    height={image.height}
                    key={`${works.id}-image-${i}`}
                    src={image.url}
                    width={image.width}
                  />
                );
              })}

              {works.detail.map((item, detailIndex) => (
                <DetailSection item={item} key={`${works.id}-detail-${detailIndex}`}>
                  {works.id === 'portfolio' && detailIndex === 1 && (
                    <Accordion title="自己チェック結果（WCAG 2.2 レベルAA）">
                      <TableWcag />
                    </Accordion>
                  )}
                  {works.id === 'schedule-app' && detailIndex === 2 && (
                    <p>
                      対応した内容一覧は、リポジトリ内の
                      <a
                        href="https://github.com/aoto-me/scheduler_public/blob/main/docs/security-checklist.md"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        チェックリスト
                        <span className="u-screenReader">（新しいウィンドウで開く）</span>
                      </a>
                      をご覧ください。
                    </p>
                  )}
                </DetailSection>
              ))}
            </article>
            <DecorativeBorder margin="5rem" />
            <Nav next={next} prev={prev} />
          </main>
          <footer className={styles.footer}>
            <Copyright />
          </footer>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replaceAll('<', String.raw`\u003c`),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replaceAll('<', String.raw`\u003c`),
        }}
        type="application/ld+json"
      />
    </PageTransition>
  );
};

export default PostPage;
