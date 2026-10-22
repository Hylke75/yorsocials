import type { IconName } from '@/content/types';
import { Icon } from './Icon';
import styles from './Blocks.module.css';

interface Value {
  icon: IconName;
  title: string;
  description: string;
}

export function ValuesGrid({ values }: { values: Value[] }) {
  return (
    <ul className="grid grid--3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {values.map((v) => (
        <li key={v.title} className={styles.value}>
          <Icon name={v.icon} size={36} className={styles.valueIcon} />
          <h3 className="h3">{v.title}</h3>
          <p>{v.description}</p>
        </li>
      ))}
    </ul>
  );
}
