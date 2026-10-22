import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  ChartColumn,
  Check,
  ChevronRight,
  Clock,
  Link2,
  List,
  Shield,
  CirclePlay,
  Compass,
  Handshake,
  Info,
  Lightbulb,
  LoaderCircle,
  Mail,
  Megaphone,
  Menu,
  MessagesSquare,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '@/content/types';

/** Eén consistente iconset (lucide). Iconen zijn decoratief tenzij `label` is gezet. */
const icons = {
  strategy: ChartColumn,
  camera: Camera,
  play: CirclePlay,
  megaphone: Megaphone,
  community: Users,
  trend: TrendingUp,
  sparkles: Sparkles,
  handshake: Handshake,
  lightbulb: Lightbulb,
  target: Target,
  compass: Compass,
  messages: MessagesSquare,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  arrowUpRight: ArrowUpRight,
  calendar: CalendarDays,
  check: Check,
  chevronRight: ChevronRight,
  info: Info,
  loader: LoaderCircle,
  mail: Mail,
  menu: Menu,
  plus: Plus,
  search: Search,
  close: X,
  clock: Clock,
  link: Link2,
  list: List,
  shield: Shield,
  alert: TriangleAlert,
} satisfies Record<IconName | string, LucideIcon>;

export type AnyIconName = keyof typeof icons;

interface IconProps {
  name: AnyIconName;
  size?: number;
  label?: string;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, label, className, strokeWidth = 2 }: IconProps) {
  const Cmp = icons[name];
  return (
    <Cmp
      size={size}
      className={className}
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
    />
  );
}
