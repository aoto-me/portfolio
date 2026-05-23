'use client';

import clsx from 'clsx';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import styles from './opening-anime.module.scss';

interface OpeningAnimeProps {
  children: React.ReactNode;
}

const TEXT = 'Thank you for visiting!';
// eslint-disable-next-line @typescript-eslint/no-misused-spread
const CHARS = [...TEXT];

/**
 * ブラウザのアスペクト比をもとに正規化（0=スマホ, 1=PC）
 */
const aspectT = (): number => {
  const aspect = window.innerWidth / window.innerHeight;
  const pcAspect = 16 / 9; // 横長
  const spAspect = 9 / 16; // 縦長
  return Math.min(1, Math.max(0, (aspect - spAspect) / (pcAspect - spAspect)));
};

/**
 * 線形補間
 * a = 開始値（t=0 のときの値）
 * b = 終了値（t=1 のときの値）
 * t = 進捗度（0〜1の範囲）
 */
const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

const makePathA = (): string => {
  const t = aspectT();
  const yControl = lerp(15, 12, t); // スマホ15 → PC12
  const xMid = 15;

  return `M 0 0 L 0 18 C 0 18 4 ${String(yControl)} ${String(xMid)} ${String(yControl)} C 26 ${String(yControl)} 30 18 30 18 L 30 0`;
};

const makePathB = (): string => {
  const t = aspectT();
  const yL = lerp(14, 12, t); // Lの高さ（スマホ14 → PC12）
  const yCurve = lerp(10, 2, t); // カーブの高さ（スマホ10 → PC2）
  const xMid = 15;

  return `M 0 0 L 0 ${String(yL)} C 0 ${String(yL)} 4 ${String(yCurve)} ${String(xMid)} ${String(yCurve)} C 26 ${String(yCurve)} 30 ${String(yL)} 30 ${String(yL)} L 30 0`;
};

export const OpeningAnime = ({ children }: OpeningAnimeProps) => {
  const pathRef = useRef<null | SVGPathElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [show, setShow] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const pathAnime = () => {
      const pathA = makePathA(); // 中間1
      const pathB = makePathB(); // 中間2
      const pathC = 'M 0 0 L 0 0 C 0 0 4 0 15 0 C 26 0 30 0 30 0 L 30 0'; // 終了

      if (pathRef.current) {
        gsap.to(pathRef.current, {
          keyframes: [
            { attr: { d: pathA }, delay: 3, duration: 0.5, ease: 'power2.in' },
            { attr: { d: pathB }, duration: 0.2 },
            { attr: { d: pathC }, duration: 0.6, ease: 'power2.out' },
          ],
        });
      }
    };

    const textAnime = () => {
      const chars = charRefs.current.filter(Boolean) as HTMLSpanElement[];

      gsap.to(chars, {
        duration: 0.35,
        ease: 'power2.out',
        stagger: 0.05,
        y: '0%',
      });

      gsap.to(chars, {
        delay: 2,
        duration: 0.3,
        ease: 'power2.in',
        stagger: 0.04,
        y: '-110%',
      });
    };

    const start = () => {
      // 2フレーム待って描画を安定させる
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShow(true);
          textAnime();
          pathAnime();
          setTimeout(() => {
            setHidden(true);
          }, 5000);
        });
      });
    };

    if (document.readyState === 'complete') {
      start();
    } else {
      window.addEventListener('load', start);
      return () => {
        window.removeEventListener('load', start);
      };
    }
  }, []);

  return (
    <>
      <div className={clsx(styles.anime, hidden && styles.isHidden)}>
        <div className={clsx(styles.anime__inner)}>
          <span aria-label={TEXT} className={styles.anime__inner__text} role="text">
            {CHARS.map((char, i) => (
              <span aria-hidden="true" className={styles.anime__inner__charOuter} key={i}>
                <span
                  className={styles.anime__inner__char}
                  ref={el => {
                    charRefs.current[i] = el;
                  }}
                >
                  {char === ' ' ? ' ' : char}
                </span>
              </span>
            ))}
          </span>
        </div>
      </div>
      <div className={clsx(styles.clipSvg, hidden && styles.isHidden)}>
        <svg fill="none" height="16" viewBox="0 0 30 16" width="30">
          <clipPath clipPathUnits="objectBoundingBox" id="clipOpening">
            <path
              d="M 0 0 L 0 18 C 0 18 4 18 15 18 C 26 18 30 18 30 18 L 30 0"
              ref={pathRef}
              transform="scale(0.0333,0.0555)"
            />
          </clipPath>
        </svg>
      </div>
      <div className={clsx('pageOuter', show && 'isShow')}>{children}</div>
    </>
  );
};
