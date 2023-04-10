import type { FunctionComponent } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import {
  DragEndParams,
  NestableDraggableFlatList,
  ShadowDecorator
} from "react-native-draggable-flatlist";
import AnimatedPressable from "./AnimatedPressable";
import { Colors } from "../types/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontSize } from "../types/Layout";
import { useAppSelector } from "../redux/hooks";
import type { NavigatorProps } from "../navigation/StackNavigator";
import { hapticSelect } from "../utilities";

type DraggableTracksProps = Pick<NavigatorProps<"Mix">, "navigation"> & {
  mixId: string,
  mix: Mix,
  reorder: (params: DragEndParams<TrackSegment>) => void,
  selectedTrack: number,
  selectedMode: boolean,
  selectTrack: (index: number) => void,
  deselectTrack: () => void
}

const DraggableTracks: FunctionComponent<DraggableTracksProps> = ({ navigation, mixId, mix, reorder, selectedTrack, selectedMode, selectTrack, deselectTrack }) => {
  const tracks = useAppSelector(({ tracks }) => tracks);
  return (
    <NestableDraggableFlatList
      data={mix.tracks}
      contentContainerStyle={styles.tracks}
      keyExtractor={(segment) => `${segment.id}-${segment.start}-${segment.end}`}
      onDragEnd={reorder}
      renderItem={({item, drag, getIndex}) => (
        <ShadowDecorator
          color={"#000"}
          opacity={0.5}
          elevation={-10}
          radius={5}
        >
          <AnimatedPressable
            onPressIn={() => {
              if (selectedMode && getIndex() === selectedTrack) deselectTrack();
              else selectTrack(getIndex());
            }}
            onLongPress={() => (
              hapticSelect().then(() => (
                navigation.navigate(
                  "EditTrackSegment",
                  { mixId, trackIndex: getIndex() }
                )
              ))
            )}
            style={[
              styles.trackPressable,
              !selectedMode || selectedTrack === getIndex()
                ? { backgroundColor: Colors[tracks[item.id].color] }
                : {}
            ]}
          >
            <Text style={styles.trackText}>
              {tracks[item.id].title} ({item.start}s to {item.end}s)
            </Text>
            <Pressable
              onLongPress={() => hapticSelect().then(drag)}
              delayLongPress={0}
              hitSlop={10}
            >
              <Ionicons
                name={"reorder-two-outline"}
                color={"#000"}
                size={FontSize.SMALL_ICON}
              />
            </Pressable>
          </AnimatedPressable>
        </ShadowDecorator>
      )}
    />
  )
};

export default DraggableTracks;

const styles = StyleSheet.create({
  tracks: {
    justifyContent: "center",
    alignItems: "stretch",
    paddingVertical: 10,
  },
  trackPressable: {
    padding: 10,
    borderColor: "#000",
    backgroundColor: "#a4a4a4",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  trackText: {
    fontSize: FontSize.BODY,
    color: "#fff"
  },
});