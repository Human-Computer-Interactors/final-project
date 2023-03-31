import type { FunctionComponent } from "react";
import { Pressable, Text, StyleSheet, Platform } from "react-native";
import {
  NestableDraggableFlatList,
  ShadowDecorator
} from "react-native-draggable-flatlist";
import { Colors } from "../types/Colors";
import { selectionAsync } from "expo-haptics";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontSize } from "../types/Layout";
import { reorderTracks } from "../redux/mixesSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { NavigatorProps } from "../navigation/StackNavigator";

type DraggableTracksProps = Pick<NavigatorProps<"Mix">, "navigation"> & {
  mixId: string,
  mix: Mix,
  selectedTrack: number | null,
  setSelectedTrack: (index: number | null) => void
}

const hapticSelect = async () => {
  if (Platform.OS === "web") return;
  return selectionAsync();
}

const DraggableTracks: FunctionComponent<DraggableTracksProps> = ({ navigation, mixId, mix, selectedTrack, setSelectedTrack }) => {
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(({ tracks }) => tracks);
  return (
    <NestableDraggableFlatList
      data={mix.tracks}
      contentContainerStyle={styles.tracks}
      keyExtractor={(segment) => `${segment.id}-${segment.start}-${segment.end}`}
      onDragEnd={({ data, to}) => {
        dispatch(reorderTracks({ mixId, tracks: data }));
        setSelectedTrack(to);
      }}
      renderItem={({item, drag, getIndex}) => (
        <ShadowDecorator
          color={"#000"}
          opacity={0.5}
          elevation={-10}
          radius={5}
        >
          <Pressable
            onPress={() => setSelectedTrack(getIndex() === selectedTrack ? null : getIndex())}
            onLongPress={() => (
              hapticSelect().then(() => (
                navigation.navigate(
                  "EditTrackSegment",
                  { mixId, trackIndex: getIndex() }
                )
              ))
            )}
            style={({pressed}) => [
              styles.trackPressable,
              selectedTrack === null || selectedTrack === getIndex()
                ? {backgroundColor: Colors[tracks[item.id].color]}
                : {},
              pressed ? styles.trackPressed : {}
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
                size={FontSize.ICON}
              />
            </Pressable>
          </Pressable>
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
  trackPressed: {
    opacity: 0.5
  },
  trackText: {
    fontSize: FontSize.BODY,
    color: "#fff"
  },
});