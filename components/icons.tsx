import { ArrowLeftIcon, Book } from 'lucide-react-native';
import { View } from 'react-native';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const Icons = {
  Book,
  ArrowLeftIcon,
  example: (asd: IconProps) => {
    return <View />;
  },
};

export type IconType = keyof typeof Icons;
