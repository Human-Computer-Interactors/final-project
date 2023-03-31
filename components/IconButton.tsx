import type { FunctionComponent } from "react";
import {
  PressableProps,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {FontSize} from "../types/Layout";

type IconButtonProps = Omit<PressableProps, "style"> & {
  style?: ViewStyle,
  iconName: keyof typeof Ionicons.glyphMap,
  iconColor: string,
  iconStyle?: TextStyle
};

const IconButton: FunctionComponent<IconButtonProps> = ({ style = {}, iconName, iconColor, iconStyle = {}, ...props }) => (
  <Pressable style={({ pressed }) => [
    styles.button,
    style,
    pressed ? styles.buttonPressed : {}
  ]} {...props}>
    <Ionicons
      name={iconName}
      size={FontSize.LARGE_ICON}
      color={iconColor}
      style={iconStyle}
    />
  </Pressable>
);

export default IconButton;

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.6
  }
})