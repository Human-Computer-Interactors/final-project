import { useEffect, useRef, useState } from "react";
import type { FunctionComponent } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Platform,
  LayoutChangeEvent
} from "react-native";
import DraggableFlatList, {
  DragEndParams,
  ShadowDecorator
} from "react-native-draggable-flatlist";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  playerHeight: number
  reorder: (params: DragEndParams<TrackSegment>) => void,
  currentTrack: number,
  selectedMode: boolean,
  selectTrack: (index: number) => void,
  deselectTrack: () => void
}

const DraggableTracks: FunctionComponent<DraggableTracksProps> = ({ navigation, mixId, mix, playerHeight, reorder, currentTrack, selectedMode, selectTrack, deselectTrack }) => {
  const scrollRef = useRef<FlatList<TrackSegment>>(null);
  const [pressableHeight, setPressableHeight] = useState(0);
  const { top, bottom } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const tracks = useAppSelector(({ tracks }) => tracks);

  const tracksHeight = height - top - playerHeight;

  const editTrack = (index: number) => {
    hapticSelect().then(() => {
      navigation.navigate(
        "EditTrackSegment",
        { mixId, trackIndex: index }
      );
    });
  };

  const onPress = (index: number) => {
    // Don't allow track selection on web, just open edit track screen
    if (Platform.OS === "web") {
      editTrack(index);
    } else if (selectedMode && index === currentTrack) {
      deselectTrack();
    } else {
      selectTrack(index);
    }
  };

  const getPressableHeight = (e: LayoutChangeEvent, index: number) => {
    if (index === 0) {
      setPressableHeight(e.nativeEvent.layout.height);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollToIndex({
      index: currentTrack,
      animated: true
    })
  }, [currentTrack]);

  return (
    <DraggableFlatList
      scrollEnabled
      // @ts-ignore
      ref={scrollRef}
      style={[styles.container, { height: tracksHeight }]}
      contentContainerStyle={[
        styles.tracks,
        { paddingBottom: Platform.OS === "web" ? bottom + 70 : tracksHeight - pressableHeight }
      ]}
      keyExtractor={(segment) => `${segment.id}-${segment.start}-${segment.end}`}
      onDragEnd={reorder}
      data={mix.tracks}
      renderItem={({ item, drag, getIndex }) => (
        <ShadowDecorator
          color={"#000"}
          opacity={0.5}
          elevation={-10}
          radius={5}
        >
          <AnimatedPressable
            onLayout={(e) => getPressableHeight(e, getIndex())}
            onPress={() => onPress(getIndex())}
            onLongPress={() => editTrack(getIndex())}
            style={[
              styles.trackPressable,
              !selectedMode || currentTrack === getIndex()
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
  container: {
    height: 300
  },
  tracks: {
    justifyContent: "center",
    alignItems: "stretch"
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