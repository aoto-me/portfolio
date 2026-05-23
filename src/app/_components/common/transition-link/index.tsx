'use client';

import gsap from 'gsap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ComponentPropsWithRef } from 'react';

type Props = ComponentPropsWithRef<typeof Link>;

export const TransitionLink = ({ href, onClick, ref, ...props }: Props) => {
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.(e);

    const page = document.querySelector<HTMLElement>('.page');
    const displacement = document.querySelector('#grain-displacement');

    if (page && displacement) {
      // 前回アニメーションのクリーンアップ
      gsap.killTweensOf(page);
      displacement.setAttribute('scale', '0');
      page.style.animation = 'none';
      page.style.opacity = '1';
      page.style.filter = 'url(#grain-dissolve)';

      const progress = { val: 0 };

      // gsap.to()の戻り値はGSAPのTweenオブジェクトであり、
      // Promiseを返さないため、awaitで待つためにPromiseでのラップが必要
      await new Promise<void>(resolve => {
        gsap.to(progress, {
          duration: 1.8,
          ease: 'power2.in',
          onUpdate: () => {
            displacement.setAttribute('scale', String(progress.val * 125));
          },
          val: 1,
        });
        gsap.to(page, {
          duration: 1.8,
          ease: 'power2.in',
          onComplete: resolve,
          opacity: 0,
        });
      });

      // View Transition が old を取得する前に scale をリセット
      displacement.setAttribute('scale', '0');
    }

    router.push(href as string);
  };

  return <Link href={href} onClick={handleClick} ref={ref} {...props} />;
};
