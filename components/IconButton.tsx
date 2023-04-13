import type { FunctionComponent } from "react";
import {
  StyleSheet,
  TextStyle
} from "react-native";
import AnimatedPressable, { AnimatedPressableProps } from "./AnimatedPressable";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontSize } from "../types/Layout";

type IconButtonProps = AnimatedPressableProps & {
  iconName: keyof typeof Ionicons.glyphMap,
  iconColor: string,
  iconStyle?: TextStyle
};

const IconButton: FunctionComponent<IconButtonProps> = ({ style = {}, iconName, iconColor, iconStyle = {}, ...props }) => (
  <AnimatedPressable style={[styles.button, style]} {...props}>
    <Ionicons
      name={iconName}
      size={FontSize.LARGE_ICON}
      color={iconColor}
      style={iconStyle}
    />
  </AnimatedPressable>
);

export default IconButton;

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  }
});