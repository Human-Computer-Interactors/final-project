import type { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { FontSize } from "../types/Layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import AnimatedPressable from "./AnimatedPressable";
import { hapticSelect } from "../utilities";

type MediaIconProps = {
  iconName: keyof typeof Ionicons.glyphMap,
  size?: number
  onPress?: () => void
};

type MediaControlsProps = {
  playing: boolean,
  play: () => void,
  pause: () => void,
  skipForward: () => void,
  skipBackward: () => void
};

const MediaIcon: FunctionComponent<MediaIconProps> = ({ iconName, size, onPress }) => (
  <AnimatedPressable
    style={styles.button}
    onPressIn={() => hapticSelect().then(onPress)}
  >
    <Ionicons
      name={iconName}
      size={size || FontSize.MEDIUM_ICON}
      color={"#000"}
    />
  </AnimatedPressable>
)

const MediaControls: FunctionComponent<MediaControlsProps> = ({ playing, play, pause, skipForward, skipBackward }) => {
  return (
    <View style={styles.container}>
      {/*<MediaIcon iconName={"play-skip-back-outline"} />*/}
      <MediaIcon iconName={"play-back-outline"} onPress={skipBackward} />
      <MediaIcon
        iconName={playing ? "pause-outline" : "play-outline"}
        size={FontSize.LARGE_ICON}
        onPress={playing ? pause : play}
      />
      <MediaIcon iconName={"play-forward-outline"} onPress={skipForward} />
      {/*<MediaIcon iconName={"play-skip-forward-outline"} />*/}
    </View>
  )
};

export default MediaControls;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    margin: 15,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});