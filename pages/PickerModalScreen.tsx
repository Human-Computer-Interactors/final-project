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

type PickerModalScreenProps = ScreenProps<"PickerModal">;

const PickerModalScreen: FunctionComponent<PickerModalScreenProps> = ({ route, navigation }) => {
  const { height } = useWindowDimensions();
  const { style, previousPage, selectedValue, pickerId, items, ...props } = route.params;
  const [value, setValue] = useState<string>(selectedValue);
  const [doneBarHeight, setDoneBarHeight] = useState<number>(0);

  const pickerHeight = height / 3;
  const goBack = () => {
    // @ts-ignore
    navigation.navigate({
      name: previousPage,
      params: { [pickerId]: value },
      merge: true
    });
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={{ height: height - pickerHeight - doneBarHeight }}
        onPress={goBack}
      />
      <View
        style={styles.doneBar}
        onLayout={(e) => setDoneBarHeight(e.nativeEvent.layout.height)}
      >
        <AnimatedPressable onPress={goBack}>
          <Text style={styles.doneText}>Done</Text>
        </AnimatedPressable>
      </View>
      <Picker
        style={[styles.picker, style, { height: pickerHeight }]}
        selectedValue={value}
        onValueChange={(newValue) => setValue(newValue)}
        {...props}
      >
        {items.map(({ label, value }) => (
          <Picker.Item label={label} value={value} key={value} />
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