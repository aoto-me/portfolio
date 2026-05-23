import type { Metadata } from 'next';
import Script from 'next/script';
import { Background, FirstLoad, OpeningAnime } from './_components/common';
import './globals.scss';

export const generateMetadata = (): Metadata => {
  const url = process.env.NEXT_PUBLIC_URL;

  return {
    alternates: { canonical: `${url}/` },
    description: 'アオトメグミのポートフォリオサイトです。',
    openGraph: {
      description: 'アオトメグミのポートフォリオサイトです。',
      images: ['/ogp.jpg'],
      locale: 'ja_JP',
      siteName: 'Portfolio - AotoMegumi',
      title: 'Portfolio - AotoMegumi',
      type: 'website',
      url: `${url}/`,
    },
    robots: {
      follow: false,
      index: false,
    },
    title: {
      default: 'Portfolio - AotoMegumi',
      template: '%s | Portfolio - AotoMegumi',
    },
  };
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html dir="ltr" lang="ja" prefix="og: https://ogp.me/ns#">
      <body>
        <FirstLoad />
        <Background />
        <OpeningAnime>{children}</OpeningAnime>
        <svg aria-hidden="true" style={{ height: 0, overflow: 'hidden', position: 'absolute', width: 0 }}>
          <defs>
            <filter colorInterpolationFilters="sRGB" height="130%" id="grain-dissolve" width="130%" x="-15%" y="-15%">
              <feTurbulence
                baseFrequency="0.012"
                id="grain-turbulence"
                numOctaves="4"
                result="noise"
                seed="8"
                type="fractalNoise"
              />
              <feDisplacementMap
                id="grain-displacement"
                in="SourceGraphic"
                in2="noise"
                scale="0"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      </body>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
          <Script id="google-analytics" strategy="lazyOnload">
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
    </html>
  );
};

export default RootLayout;
