'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import styles from './background.module.scss';

const WebGl = dynamic(() => import('./web-gl'), { ssr: false });

export const Background = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const start = () => {
      // 2フレーム待って描画を安定させる
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShow(true);
        });
      });
    };

    if ('requestIdleCallback' in globalThis) {
      globalThis.requestIdleCallback(() => {
        start();
      });
    } else {
      setTimeout(() => {
        start();
      }, 1000);
    }
  }, []);

  return (
    <div className={styles.bg}>
      {show && <WebGl />}
      <div className={styles.bg__noise}></div>
      <div className={styles.bg__shadow}></div>
    </div>
  );
};
