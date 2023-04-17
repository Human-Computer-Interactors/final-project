import { useState } from "react";
import type { FunctionComponent } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Text
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import type { ScreenProps } from "../navigation/StackNavigator";
import AnimatedPressable from "../components/AnimatedPressable";
import { FontSize } from "../types/Layout";
import { NULL_PLACEHOLDER } from "../components/Picker";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setDataField } from "../redux/slices/tempDataSlice";
import type { ItemValue } from "@react-native-picker/picker/typings/Picker";

type PickerModalScreenProps = ScreenProps<"PickerModal">;

const PickerModalScreen: FunctionComponent<PickerModalScreenProps> = ({ route, navigation }) => {
  const { height } = useWindowDimensions();
  const { style, dataId, items, ...props } = route.params;
  const [doneBarHeight, setDoneBarHeight] = useState<number>(0);

  const value = useAppSelector(({ tempData }) => tempData[dataId]);
  const pickerHeight = height / 3;

  const dispatch = useAppDispatch();
  const setValue = (value: ItemValue | typeof NULL_PLACEHOLDER) => {
    let newValue = value === NULL_PLACEHOLDER ? null : value;
    dispatch(setDataField({ key: dataId, value: newValue }));
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={{ height: height - pickerHeight - doneBarHeight }}
        onPress={() => navigation.pop()}
      />
      <View
        style={styles.doneBar}
        onLayout={(e) => setDoneBarHeight(e.nativeEvent.layout.height)}
      >
        <AnimatedPressable onPress={() => navigation.pop()}>
          <Text style={styles.doneText}>Done</Text>
        </AnimatedPressable>
      </View>
      <Picker
        style={[styles.picker, style, { height: pickerHeight }]}
        selectedValue={value}
        onValueChange={setValue}
        {...props}
      >
        {items.map(({ label, value }) => (
          <Picker.Item
            label={label}
            value={value || NULL_PLACEHOLDER}
            key={value || NULL_PLACEHOLDER}
          />
        ))}
      </Picker>
    </View>
  )
};

export default PickerModalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "stretch"
  },
  doneBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 15
  },
  doneText: {
    fontWeight: "bold",
    fontSize: FontSize.TITLE
  },
  picker: {
    backgroundColor: "#e0e0e0"
  }
})