import {
  Armchair,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  ChartNoAxesCombined,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsDownUp,
  Clock,
  DoorOpen,
  Eye,
  FileText,
  Flag,
  Flame,
  Hand,
  HandHeart,
  Heart,
  House,
  Info,
  Languages,
  Layers,
  Lock,
  MessageCircle,
  Moon,
  MoveUp,
  Plus,
  Repeat,
  RotateCcw,
  Settings2,
  Shield,
  Sparkles,
  Star,
  Sunrise,
  Target,
  Timer,
  Trash,
  TrendingUp,
  Users,
  UsersRound,
  Utensils,
  UtensilsCrossed,
  WifiOff,
  X,
  type LucideIcon,
} from 'lucide-react-native';

import { Colors, type ColorName } from '@/constants/tokens';
import { useT } from '@/hooks/use-t';

const ICONS: Record<string, LucideIcon> = {
  armchair: Armchair,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  bell: Bell,
  'book-open': BookOpen,
  'chart-no-axes-combined': ChartNoAxesCombined,
  check: Check,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevrons-down': ChevronsDown,
  'chevrons-down-up': ChevronsDownUp,
  clock: Clock,
  'door-open': DoorOpen,
  eye: Eye,
  'file-text': FileText,
  flag: Flag,
  flame: Flame,
  hand: Hand,
  'hand-heart': HandHeart,
  heart: Heart,
  house: House,
  info: Info,
  languages: Languages,
  layers: Layers,
  lock: Lock,
  'message-circle': MessageCircle,
  moon: Moon,
  'move-up': MoveUp,
  plus: Plus,
  repeat: Repeat,
  'rotate-ccw': RotateCcw,
  'settings-2': Settings2,
  shield: Shield,
  sparkles: Sparkles,
  star: Star,
  sunrise: Sunrise,
  target: Target,
  timer: Timer,
  trash: Trash,
  'trending-up': TrendingUp,
  users: Users,
  'users-round': UsersRound,
  utensils: Utensils,
  'utensils-crossed': UtensilsCrossed,
  'wifi-off': WifiOff,
  x: X,
};

const DIRECTIONAL = new Set(['arrow-left', 'arrow-right', 'arrow-up-right', 'chevron-left', 'chevron-right']);

export type IconProps = {
  name: string;
  size?: number;
  color?: ColorName;
  strokeWidth?: number;
};

export function Icon({ name, size = 18, color = 'ink', strokeWidth = 2 }: IconProps) {
  const { isRTL } = useT();
  const Component = ICONS[name] ?? FileText;
  const flip = isRTL && DIRECTIONAL.has(name);
  return (
    <Component
      size={size}
      color={Colors[color]}
      strokeWidth={strokeWidth}
      style={flip ? { transform: [{ scaleX: -1 }] } : undefined}
    />
  );
}
