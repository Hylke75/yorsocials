import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { Icon, type AnyIconName } from './Icon';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'green';

interface CommonProps {
  variant?: Variant;
  size?: 'default' | 'small';
  icon?: AnyIconName | null;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

function classes({ variant = 'primary', size = 'default', fullWidth, className }: CommonProps) {
  return [styles.button, styles[variant], size === 'small' && styles.small, fullWidth && styles.full, className]
    .filter(Boolean)
    .join(' ');
}

function Content({ icon = 'arrowRight', iconPosition = 'end', children }: CommonProps) {
  return (
    <>
      {icon && iconPosition === 'start' && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {icon && iconPosition === 'end' && <Icon name={icon} size={18} />}
    </>
  );
}

interface ButtonLinkProps extends CommonProps {
  href: string;
  /** Voor het analytics-event `cta_click` (alleen na toestemming verstuurd). */
  placement?: string;
  /** Welk analytics-event een klik oplevert. */
  trackAs?: 'cta' | 'booking';
  external?: boolean;
}

export function ButtonLink(props: ButtonLinkProps) {
  const { href, placement, external, trackAs = 'cta' } = props;
  const trackingProps = placement ? { 'data-track': trackAs, 'data-placement': placement, 'data-destination': href } : {};
  if (external) {
    return (
      <a href={href} className={classes(props)} target="_blank" rel="noopener noreferrer" {...trackingProps}>
        <Content {...props} />
        <span className="visually-hidden"> (opent in nieuw venster)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes(props)} {...trackingProps}>
      <Content {...props} />
    </Link>
  );
}

type ButtonProps = CommonProps & Omit<ComponentProps<'button'>, 'children' | 'className'>;

export function Button({ variant, size, icon, iconPosition, fullWidth, children, className, ...rest }: ButtonProps) {
  const common = { variant, size, icon, iconPosition, fullWidth, children, className };
  return (
    <button className={classes(common)} {...rest}>
      <Content {...common} />
    </button>
  );
}
