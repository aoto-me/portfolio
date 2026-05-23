import styles from './article-header.module.scss';

interface ArticleHeaderProps {
  category: string;
  index: number;
  siteType: string;
  title: string;
}

export const ArticleHeader = ({ category, index, siteType, title }: ArticleHeaderProps) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.header__title}>
        <span className={styles.header__title__number}>{String(index + 1).padStart(2, '0')}</span>
        {title}
      </h1>
      <dl>
        <dt className="u-screenReader">プロジェクトの種類</dt>
        <dd>{category}</dd>
        <dt className="u-screenReader">サイトの形態</dt>
        <dd>{siteType}</dd>
      </dl>
    </header>
  );
};
