import type { FunctionComponent } from "react";
import { useState, useEffect } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import Picker from "../components/Picker";
import type { ScreenProps } from "../navigation/StackNavigator";
import IconButton from "../components/IconButton";
import AnimatedPressable from "../components/AnimatedPressable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { FontSize } from "../types/Layout";
import { addTrackSegment, editTrackSegment } from "../redux/slices/mixesSlice";
import { setDataField } from "../redux/slices/tempDataSlice";

type EditTrackSegmentScreenProps = ScreenProps<"EditTrackSegment">;

const INPUTS = [
  { key: "start", title: "Start"},
  { key: "end", title: "End"}
];

const EditTrackSegmentScreen: FunctionComponent<EditTrackSegmentScreenProps> = ({ route, navigation }) => {
  const { mixId, trackIndex } = route.params;
  const tracks = useAppSelector(({ tracks }) => tracks);

  // Only for when screen is being edited
  const trackSegment = (trackIndex || trackIndex === 0)
    && useAppSelector(({ mixes }) => mixes[mixId].tracks[trackIndex]);
  const trackId = useAppSelector(({ tempData }) => tempData.trackSegmentTrackId);

  const [segment, setSegment] = useState<Partial<TrackSegment>>(trackSegment || {});

  const { top, bottom } = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const goBack = () => {
    navigation.pop();
    dispatch(setDataField({ key: "trackSegmentTrackId", value: null }));
  };

  const setTrackId = (id) => {
    setSegment((prev) => ({ ...prev, id }))
  };

  const setIntegerField = (key: string, value: string) => {
    let intValue = value.trim().length === 0 ? 0 : parseInt(value);
    if (isNaN(intValue)) {
      return;
    }
    setSegment((prev) => ({ ...prev, [key]: intValue }));
  };

  const validate = (segment: Partial<TrackSegment>): boolean => {
    if (!segment.id) {
      Alert.alert("Invalid submission", "Please select a track");
    } else if (segment.start >= segment.end) {
      Alert.alert("Invalid submission", "End of segment must be after start");
    } else {
      return true;
    }
    return false;
  }

  const update = () => {
    const cleanedSegment: Partial<TrackSegment> = { ...segment };
    if (!cleanedSegment.start) {
      cleanedSegment.start = 0;
    }
    if (!cleanedSegment.end) {
      cleanedSegment.end = 0;
    }
    if (!validate(cleanedSegment)) {
      return;
    }
    const trackSegment = cleanedSegment as TrackSegment;
    if (trackIndex || trackIndex === 0) {
      dispatch(editTrackSegment({ mixId, trackIndex, ...trackSegment }));
    } else {
      dispatch(addTrackSegment({ mixId, ...trackSegment }));
    }
    goBack();
  };

  useEffect(() => {
    if (trackSegment) {
      dispatch(setDataField({ key: "trackSegmentTrackId", value: trackSegment.id }));
    }
  }, []);

  useEffect(() => {
    if (trackId || !trackSegment) {
      setTrackId(trackId);
    }
  }, [trackId]);

  return (
    <ScrollView
      alwaysBounceVertical={false}
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: top, paddingBottom: bottom }
      ]}
    >
      <IconButton
        style={styles.closeButton}
        iconName={"close"}
        iconColor={"#000"}
        onPress={goBack}
      />
      <Picker
        style={styles.title}
        includePlaceholder={!trackSegment}
        selectedValue={segment.id}
        onValueChange={(value) => setTrackId(value as string)}
        getDisplayValue={(id) => tracks[id].title}
        dataId={"trackSegmentTrackId"}
        items={Object.keys(tracks)}
      />
      <View style={styles.form}>
        {INPUTS.map(({ key, title }) => (
          <View style={styles.inputRow} key={key}>
            <Text style={styles.inputLabel}>{title}:</Text>
            <TextInput
              style={styles.textInput}
              value={(segment[key] || 0).toString()}
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