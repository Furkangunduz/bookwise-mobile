import { ArrowLeftIcon, Book, IndentDecrease, IndentIncrease, Loader, Plus, Search, Trash } from 'lucide-react-native';
import { View } from 'react-native';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const Icons = {
  Book,
  ArrowLeftIcon,
  Plus,
  Trash,
  Loader,
  IndentDecrease,
  IndentIncrease,
  Search,
  example: (asd: IconProps) => {
    return <View />;
  },
};

export type IconType = keyof typeof Icons;
