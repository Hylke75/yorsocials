import type { ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './Notice.module.css';

interface NoticeProps {
  tone?: 'info' | 'demo';
  children: ReactNode;
  className?: string;
}

export function Notice({ tone = 'info', children, className }: NoticeProps) {
  return (
    <div className={[styles.notice, tone === 'demo' && styles.demo, className].filter(Boolean).join(' ')}>
      <Icon name={tone === 'demo' ? 'alert' : 'info'} size={18} />
      <div>{children}</div>
    </div>
  );
}
