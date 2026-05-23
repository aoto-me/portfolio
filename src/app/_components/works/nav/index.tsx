import { TransitionLink } from '@/app/_components/common';
import type { WorksNavItem } from '@/app/_types';
import clsx from 'clsx';
import Image from 'next/image';
import styles from './nav.module.scss';

interface NavProps {
  next: WorksNavItem;
  prev: WorksNavItem;
}

export const Nav = ({ next, prev }: NavProps) => (
  <nav className={styles.nav}>
    <div className={styles.nav__arrows}>
      <TransitionLink aria-label={`Prev（${prev.title}）の詳細へ`} href={`/works/${prev.id}`}>
        <span className={clsx(styles.nav__arrows__arrow, styles['nav__arrows__arrow--prev'])}>
          <svg height="60" viewBox="0 0 60 60" width="60" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" fill="none" r="29.5" stroke="#333" strokeWidth="1" />
          </svg>
          <Image alt="←" fetchPriority="high" height={21} src="/img/arrow_black.svg" width={38} />
        </span>
        <span className={styles.nav__arrows__text}>Prev</span>
      </TransitionLink>
      <TransitionLink aria-label={`Next（${next.title}）の詳細へ`} href={`/works/${next.id}`}>
        <span className={clsx(styles.nav__arrows__arrow, styles['nav__arrows__arrow--next'])}>
          <svg height="60" viewBox="0 0 60 60" width="60" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" fill="none" r="29.5" stroke="#333" strokeWidth="1" />
          </svg>
          <Image alt="→" fetchPriority="high" height={21} src="/img/arrow_black.svg" width={38} />
        </span>
        <span className={styles.nav__arrows__text}>Next</span>
      </TransitionLink>
    </div>
    <TransitionLink className={styles.nav__button} href="/">
      <span className={styles.nav__button__bg}></span>
      <span className={styles.nav__button__text}>一覧へ戻る</span>
    </TransitionLink>
  </nav>
);
