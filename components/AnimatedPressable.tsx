import type { FunctionComponent } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  StyleProp,
  ViewStyle
} from "react-native";

export type AnimatedPressableProps = PressableProps & {
  style?: StyleProp<ViewStyle>
};

const AnimatedPressable: FunctionComponent<AnimatedPressableProps> = ({ style = {}, ...props }) => (
  <Pressable
    style={({ pressed }) => [style, pressed ? styles.pressed : {}]}
    {...props}
  />
);

export default AnimatedPressable;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5
  }
});