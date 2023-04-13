import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Platform
} from "react-native";
import type { DragEndParams } from "react-native-draggable-flatlist";
import type { NavigatorProps } from "../navigation/StackNavigator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontSize } from "../types/Layout";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { reorderTracks } from "../redux/mixesSlice";
import ClipsViewer from "../components/ClipsViewer";
import MediaControls from "../components/MediaControls";
import DraggableTracks from "../components/DraggableTracks";
import IconButton from "../components/IconButton";
import TrackPlayer from "react-native-track-player";
import { range, modulo } from "../utilities";

type MixScreenProps = NavigatorProps<"Mix">;

const MixScreen: FunctionComponent<MixScreenProps> = ({ route, navigation }) => {
  // Index of current track being played
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  // Whether player is in "Selected Mode" (will repeat single track segment)
  const [selectedMode, setSelectedMode] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [playTimer, setPlayTimer] = useState<NodeJS.Timeout | null>(null);
  const [playerHeight, setPlayerHeight] = useState<number>(0);

  const { mixId } = route.params;
  const mix = useAppSelector(({ mixes }) => mixes[mixId]);
  const tracks = useAppSelector(({ tracks }) => tracks);
  const dispatch = useAppDispatch();
  const { top, bottom } = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();

  const skipTo = async (position: number, relative: boolean = true, timeOffset: number = 0, startPlaying: boolean = false) => {
    let index = position;
    if (relative) {
      index = modulo(
        await TrackPlayer.getCurrentTrack() + position,
        mix.tracks.length
      );
    }
    const mixTrack = mix.tracks[index];
    const start = mixTrack.start + timeOffset;
    await TrackPlayer.skip(index, start);
    setCurrentTrack(index);
    if (startPlaying) {
      await TrackPlayer.play();
      setPlaying(true);
    }
    if (playing || startPlaying) {
      const timeoutId = setTimeout(
        selectedMode ? repeat : skipForward,
        (mixTrack.end - start) * 1000,
        true
      );
      clearTimeout(playTimer);
      setPlayTimer(timeoutId);
    }
  }

  const repeat = (startPlaying: boolean) => skipTo(0, true, 0, startPlaying);
  const skipForward = () => skipTo(1);
  const skipBackward = () => skipTo(-1);

  const play = async () => {
    const pos = await TrackPlayer.getPosition();
    const track = await TrackPlayer.getCurrentTrack();
    await TrackPlayer.play();
    setPlaying(true);
    const timerId = setTimeout(
      selectedMode ? repeat : skipForward,
      (mix.tracks[track].end - pos) * 1000,
      true
    );
    setPlayTimer(timerId);
  };

  const pause = async () => {
    clearTimeout(playTimer);
    await TrackPlayer.pause();
    setPlaying(false);
  };

  const selectTrack = async (index: number) => {
    if (index !== currentTrack) {
      setCurrentTrack(index);
      await skipTo(index, false);
    }
    setSelectedMode(true);
  }

  const deselectTrack = async () => {
    setSelectedMode(false);
  };

  const reorderQueue = async ({ data, from, to } : DragEndParams<TrackSegment>) => {
    if (from === to) return;
    // Special handling if moving the current track (to allow it to keep playing)
    if (from === currentTrack) {
      if (from > to) {
        // Add moved tracks after track, then remove them from before track
        await TrackPlayer.add(
          mix.tracks.slice(to, from).map(({ id }) => tracks[id]),
          from + 1
        );
        await TrackPlayer.remove(range(to, from));
      } else {
        // Remove tracks from after track, then add them to before track
        await TrackPlayer.remove(range(from, to));
        await TrackPlayer.add(
          mix.tracks.slice(from + 1, to + 1).map(({ id }) => tracks[id]),
          from
        )
      }
    } else {
      if (from > to) {
        await TrackPlayer.remove(from);
        await TrackPlayer.add(tracks[mix.tracks[from].id], to);
      } else {
        await TrackPlayer.add(tracks[mix.tracks[from].id], to);
        await TrackPlayer.remove(from);
      }
    }
    dispatch(reorderTracks({ mixId, tracks: data }));
  };

  // Set up queue on page load
  useEffect(() => {
    const setUpQueue = async () => {
      await TrackPlayer.reset();
      await TrackPlayer.add(mix.tracks.map(({ id }) => tracks[id]));
      await TrackPlayer.skip(0);
    }
    setUpQueue();
    return () => {
      TrackPlayer.reset();
    };
  }, []);

  // Adjust timer to repeat instead of skipping to next track in selected mode
  useEffect(() => {
    if (!playing) return;
    const changeToFromRepeat = async (selectedMode: boolean) => {
      const track = await TrackPlayer.getCurrentTrack();
      const pos = await TrackPlayer.getPosition();
      const timerId = setTimeout(
        selectedMode ? repeat : skipForward,
        (mix.tracks[track].end - pos) * 1000,
        false
      );
      clearTimeout(playTimer);
      setPlayTimer(timerId);
    };
    changeToFromRepeat(selectedMode);
  }, [selectedMode]);

  return (
    <View style={[styles.container, { paddingTop: top, height }]}>
      <View style={styles.contentContainer} onLayout={(e) => {
        setPlayerHeight(e.nativeEvent.layout.height);
      }}>
        <IconButton
          style={styles.backButton}
          iconName={"chevron-back"}
          iconColor={"#000"}
          onPress={() => navigation.pop()}
        />
        <Text style={styles.title}>{mix.title}</Text>
        <Text style={styles.artist}>{mix.team}</Text>
        {Platform.OS !== "web" && (
          <>
            <ClipsViewer
              currentTrack={currentTrack}
              selectedMode={selectedMode}
              playing={playing}
              playTimer={playTimer}
              mixId={mixId}
              pause={pause}
              skipTo={skipTo}
            />
            <MediaControls
              playing={playing}
              play={play}
              pause={pause}
              skipForward={skipForward}
              skipBackward={skipBackward}
            />
          </>
        )}
      </View>
      <DraggableTracks
        navigation={navigation}
        mixId={mixId}
        mix={mix}
        playerHeight={playerHeight}
        reorder={reorderQueue}
        currentTrack={currentTrack}
        selectedMode={selectedMode}
        selectTrack={selectTrack}
        deselectTrack={deselectTrack}
      />
      <IconButton
        style={{
          ...styles.addButton, bottom: bottom + 10, left: (width - 50) / 2
        }}
        iconName={"add"}
        iconColor={"#fff"}
        iconStyle={styles.addIcon}
      />
    </View>
  );
};

export default MixScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between"
  },
  contentContainer: {
    marginBottom: 20
  },
  backButton: {
    margin: 10,
    alignSelf: "flex-start"
  },
  title: {
    fontSize: FontSize.HEADER,
    textAlign: "center"
  },
  artist: {
    fontSize: FontSize.SUBHEADER,
    fontStyle: "italic",
    textAlign: "center"
  },
  blackBox: {
    backgroundColor: "#000",
    padding: 10,
    marginTop: 20,
    height: 200,
    justifyContent: "center",
    alignItems: "center"
  },
  blackBoxText: {
    color: "#fff"
  },
  addButton: {
    position: "absolute",
    backgroundColor: "#000",
    width: 50,
    height: 50,
    borderRadius: 10000
  },
  addIcon: {
    marginLeft: 3
  }
});