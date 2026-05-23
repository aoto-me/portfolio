import { TransitionLink } from '@/app/_components/common';
import Image from 'next/image';
import styles from './header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <TransitionLink aria-label="Portfolio - AotoMegumi のトップページへ" href="/">
        <Image alt="AotoMegumi" height={22} src="/img/logo_black.svg" width={195} />
      </TransitionLink>
    </header>
  );
};
