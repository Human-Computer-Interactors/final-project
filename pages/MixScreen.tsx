import type { FunctionComponent } from "react";
import { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  useWindowDimensions
} from "react-native";
import { NestableScrollContainer } from "react-native-draggable-flatlist";
import type { NavigatorProps } from "../navigation/StackNavigator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontSize } from "../types/Layout";
import { useAppSelector } from "../redux/hooks";
import ClipsViewer from "../components/ClipsViewer";
import MediaControls from "../components/MediaControls";
import DraggableTracks from "../components/DraggableTracks";
import IconButton from "../components/IconButton";

type MixScreenProps = NavigatorProps<"Mix">;

const MixScreen: FunctionComponent<MixScreenProps> = ({ route, navigation }) => {
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);

  const { mixId } = route.params;
  const mix = useAppSelector(({ mixes }) => mixes[mixId]);
  const { top, bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <NestableScrollContainer
        alwaysBounceVertical={false}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: top, paddingBottom: bottom + 60 }
        ]}
      >
        <IconButton
          style={styles.backButton}
          iconName={"chevron-back"}
          iconColor={"#000"}
          onPress={() => navigation.pop()}
        />
        <Text style={styles.title}>{mix.title}</Text>
        <Text style={styles.artist}>{mix.team}</Text>
        <ClipsViewer selectedTrack={selectedTrack} mixId={mixId} />
        <MediaControls playing={playing} setPlaying={setPlaying} />
        <DraggableTracks
          navigation={navigation}
          mixId={mixId}
          mix={mix}
          selectedTrack={selectedTrack}
          setSelectedTrack={setSelectedTrack}
        />
      </NestableScrollContainer>
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
    flex: 1
  },
  contentContainer: {
    alignItems: "stretch"
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