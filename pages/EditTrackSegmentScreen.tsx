import type { FunctionComponent } from "react";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import type { NavigatorProps } from "../navigation/StackNavigator";
import IconButton from "../components/IconButton";
import AnimatedPressable from "../components/AnimatedPressable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { FontSize } from "../types/Layout";
import { addTrackSegment, editTrackSegment } from "../redux/mixesSlice";

type EditTrackSegmentScreen = NavigatorProps<"EditTrackSegment">;

const INPUTS = [
  { key: "start", title: "Start"},
  { key: "end", title: "End"}
];

const EditTrackSegmentScreen: FunctionComponent<EditTrackSegmentScreen> = ({ route, navigation }) => {
  const { mixId, trackIndex } = route.params;
  const trackSegment = useAppSelector(({ mixes }) => mixes[mixId].tracks[trackIndex]);
  const track = useAppSelector(({ tracks }) => tracks[trackSegment.id]);
  const { top, bottom } = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const [segment, setSegment] = useState<Partial<TrackSegment>>(trackSegment);

  const setIntegerField = (key: string, value: string) => {
    let intValue = value.trim().length === 0 ? 0 : parseInt(value);
    if (isNaN(intValue)) {
      return;
    }
    setSegment((prev) => ({ ...prev, [key]: intValue }));
  };

  const update = () => {
    if (trackIndex || trackIndex === 0) {
      dispatch(editTrackSegment({ mixId, trackIndex, ...(segment as TrackSegment) }));
    } else {
      dispatch(addTrackSegment({ mixId, ...(segment as TrackSegment) }));
    }
    navigation.pop();
  };

  return (
    <ScrollView
      alwaysBounceVertical={false}
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: top + 30, paddingBottom: bottom }
      ]}
    >
      <IconButton
        style={styles.closeButton}
        iconName={"close"}
        iconColor={"#000"}
        onPress={() => navigation.pop()}
      />
      <Text style={styles.title}>{track.title}</Text>
      <View style={styles.form}>
        {INPUTS.map(({ key, title }) => (
          <View style={styles.inputRow} key={key}>
            <Text style={styles.inputLabel}>{title}:</Text>
            <TextInput
              style={styles.textInput}
              value={segment[key].toString()}
              keyboardType={"number-pad"}
              returnKeyType={"next"}
              onChangeText={(value) => setIntegerField(key, value)}
            />
          </View>
        ))}
      </View>
      <AnimatedPressable style={styles.saveButton} onPress={update}>
        <Text style={styles.saveButtonText}>Save</Text>
      </AnimatedPressable>
    </ScrollView>
  );
};

export default EditTrackSegmentScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1
  },
  contentContainer: {
    alignItems: "center",
  },
  closeButton: {
    margin: 10,
    alignSelf: "flex-start"
  },
  title: {
    fontSize: FontSize.HEADER,
    textAlign: "center"
  },
  form: {
    paddingVertical: 30,
    alignItems: "center",
    flex: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5
  },
  inputLabel: {
    fontSize: FontSize.TITLE,
    width: 50
  },
  textInput: {
    fontSize: FontSize.TITLE,
    padding: 10,
    borderBottomWidth: 1,
    marginLeft: 20,
    minWidth: 50
  },
  saveButton: {
    padding: 10,
    backgroundColor: "#000"
  },
  saveButtonText: {
    color: "#fff",
    fontSize: FontSize.TITLE
  }
})