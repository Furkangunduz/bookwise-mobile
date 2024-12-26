import { TouchableOpacity } from "react-native";

export type IconButtonProps = {
  icon: React.ElementType;
  onPress: () => void;
  onLongPress?: () => void;
  size?: number;
  disabled?: boolean;
}

export const IconButton = ({ icon: Icon, onPress, onLongPress, size = 20, disabled }: IconButtonProps) => (
  <TouchableOpacity 
    onPress={onPress}
    onLongPress={onLongPress}
    disabled={disabled}
    style={ {
      padding: 8,
      borderRadius: 20,
    }}
  >
    <Icon size={size} color="#ffffff" strokeWidth={2} />
  </TouchableOpacity>
);
