interface DlItemProps {
  items: string[];
  label: string;
}

export const DlItem = ({ items, label }: DlItemProps) => {
  if (items.length === 0) return null;
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        {items.map((item, i) => (
          <span key={`${label}-${i}`}>{item}</span>
        ))}
      </dd>
    </div>
  );
};
