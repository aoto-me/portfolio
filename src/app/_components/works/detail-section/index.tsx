import type { Detail } from '@/app/_types';
import Image from 'next/image';
import styles from './detail-section.module.scss';

interface DetailSectionProps {
  children?: React.ReactNode;
  item: Detail;
}

export const DetailSection = ({ children, item }: DetailSectionProps) => (
  <div className={styles.detail} data-detail>
    <h2>{item.heading}</h2>
    {item.images.map((image, i) => (
      <figure key={i}>
        <Image alt={image.alt.split('　')[0]} height={image.height} src={image.url} width={image.width} />
        <figcaption>{image.alt.split('　')[1]}</figcaption>
      </figure>
    ))}
    {item.text
      .split('\n')
      .filter(line => line.trim() !== '')
      .map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    {item.listTitle && (
      <section>
        <h3>{item.listTitle}</h3>
        {item.list && (
          <ul>
            {item.list
              .split('\n')
              .filter(line => line.trim() !== '')
              .map((line, i) => (
                <li key={i}>{line}</li>
              ))}
          </ul>
        )}
      </section>
    )}
    {children}
  </div>
);
