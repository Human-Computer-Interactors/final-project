import { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  useWindowDimensions
} from "react-native";
import { useAppSelector } from "../redux/hooks";
import type { FunctionComponent } from "react";
import { Colors } from "../types/Colors";

type ClipsViewerProps = {
  selectedTrack: number | null,
  mixId: string
};

const ONE_SECOND_WIDTH = 5;

const ClipsViewer: FunctionComponent<ClipsViewerProps> = ({ selectedTrack, mixId }) => {
  const flatListRef = useRef<FlatList>(null);
  const trackSegments = useAppSelector(({ mixes }) => mixes[mixId].tracks);
  const tracks = useAppSelector(({ tracks }) => tracks);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (selectedTrack !== null) {
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: selectedTrack,
        viewOffset: width / 2
      });
    }
  }, [selectedTrack]);

  return (
    <View style={styles.container}>
      <View style={[styles.pointer, { left: width / 2 }]} />
      <FlatList
        style={{ width }}
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        data={trackSegments}
        keyExtractor={(segment) => `${segment.id}-${segment.start}-${segment.end}`}
        renderItem={({ item, index }) => (
          <View style={[styles.trackSegment, {
            width: ONE_SECOND_WIDTH * (item.end - item.start),
            backgroundColor: selectedTrack === null || selectedTrack === index
              ? Colors[tracks[item.id].color]
              : "#a4a4a4"
          }]} />
        )}
      />
    </View>
  )
};

export default ClipsViewer;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },
  pointer: {
    position: "absolute",
    height: "100%",
    width: 2,
    backgroundColor: "#000",
    zIndex: 100
  },
  contentContainer: {
    flexDirection: "row",
    paddingHorizontal: "50%"
  },
  trackSegment: {
    backgroundColor: "#fff",
    height: 150,
    marginVertical: 50,
    borderWidth: 1
  }
})