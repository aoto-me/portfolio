import { CutCorner } from '../cut-corner';
import styles from './case-block.module.scss';

interface CaseBlockProps {
  screenReaderTitle: string;
  sections: [Section, Section] | [Section];
}

interface Section {
  heading: string;
  text: string;
}

export const CaseBlock = ({ screenReaderTitle, sections }: CaseBlockProps) => {
  const variants = sections.length === 1 ? ['solution'] : ['problem', 'solution'];

  return (
    <CutCorner>
      <h2 className="u-screenReader">{screenReaderTitle}</h2>
      {sections.map((section, i) => (
        <div className={`${styles.case} ${styles[`case--${variants[i]}`]}`} key={i}>
          <h3>{section.heading}</h3>
          <ul>
            {section.text
              .split('\n')
              .filter(line => line.trim() !== '')
              .map((line, j) => (
                <li key={j}>{line}</li>
              ))}
          </ul>
        </div>
      ))}
    </CutCorner>
  );
};
