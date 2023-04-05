import type { FunctionComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import AnimatedPressable from "./AnimatedPressable";
import { FontSize } from "../types/Layout";
import type { NavigatorProps } from "../navigation/StackNavigator";
import { useAppSelector } from "../redux/hooks";
import { Colors } from "../types/Colors";

type MixCardProps = MixWithId & Pick<NavigatorProps<"Home">, "navigation">;

const MixCard: FunctionComponent<MixCardProps> = ({ id, title, team, tracks, image, navigation }) => {
  const trackData = useAppSelector(({ tracks }) => tracks);
  const uniqueTracks = Object.keys(trackData).filter((trackId) => tracks.findIndex(({ id }) => id === trackId) >= 0);
  return (
    <AnimatedPressable
      style={styles.card}
      onPress={() => navigation.navigate("Mix", { mixId: id })}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artist}>{team}</Text>
      </View>
      <View style={styles.labels}>
        {uniqueTracks.map((id) => {
          const track = trackData[id];
          return (
            <View
              key={id}
              style={[
                styles.labelContainer,
                { backgroundColor: Colors[track.color] }
              ]}
            >
              <Text style={styles.labelText}>{track.title}</Text>
            </View>
          );
        })}
      </View>
    </AnimatedPressable>
  )
};

export default MixCard;

const styles = StyleSheet.create({
  card: {
    borderColor: "#000",
    borderWidth: 1,
    padding: 10,
    margin: 5
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between"
  },
  title: {
    fontSize: FontSize.TITLE
  },
  artist: {
    fontSize: FontSize.BODY,
    fontStyle: "italic"
  },
  labels: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 5
  },
  labelContainer: {
    padding: 5,
    marginRight: 5,
    marginTop: 5,
    borderColor: "#000",
    borderWidth: 1
  },
  labelText: {
    color: "#fff"
  }
})