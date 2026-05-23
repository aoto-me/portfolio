import Image from 'next/image';
import { type ItemList, type ListItem, type WithContext } from 'schema-dts';
import { Copyright, Frame, PageTransition } from './_components/common';
import { SwiperWrapper } from './_components/home';
import { getPosts } from './_libs';
import styles from './page.module.scss';

export const dynamic = 'force-static';

const Home = async () => {
  const worksList = await getPosts();
  const url = process.env.NEXT_PUBLIC_URL;

  const itemListElement: ListItem[] = worksList.map((work, index) => ({
    '@type': 'ListItem',
    name: work.title,
    position: index + 1,
    url: `${url}/works/${work.id}`,
  }));

  const jsonLd: WithContext<ItemList> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    description: 'アオトメグミのポートフォリオサイトです。',
    image: `${url}/ogp.jpg`,
    itemListElement,
    name: 'Portfolio - AotoMegumi',
  };

  return (
    <PageTransition name="home-transition">
      <div className={`${styles.page} homeFadeIn page`}>
        <div className={`${styles.page__inner} page__inner`}>
          <header className={styles.header}>
            <h1>
              <Image alt="Portfolio - AotoMegumi" height={54} loading={'eager'} src="/img/logo.svg" width={250} />
            </h1>
          </header>
          <main className={styles.main}>
            <Frame />
            <Image alt="" className={styles.portfolio} height={39} src={'/img/portfolio.svg'} width={230} />
            <SwiperWrapper worksList={worksList} />
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
    </PageTransition>
  );
};

export default Home;
