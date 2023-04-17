import type { FunctionComponent } from "react";
import {
  Text,
  Platform,
  StyleProp,
  TextStyle,
  StyleSheet
} from "react-native";
import {
  Picker as PickerComponent,
  PickerProps as PickerComponentProps
} from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NavigatorProps } from "../navigation/StackNavigator";
import AnimatedPressable from "./AnimatedPressable";
import { useNavigation } from "@react-navigation/native";
import { FontSize } from "../types/Layout";
import type { ItemValue } from "@react-native-picker/picker/typings/Picker";
import type { TempDataState } from "../redux/slices/tempDataSlice";

type PickerProps = Omit<PickerComponentProps, "style" | "selectedValue" | "children" | "onValueChange"> & {
  includePlaceholder: boolean,
  selectedValue: string,
  onValueChange: (value: ItemValue | null) => void,
  style?: StyleProp<TextStyle>
  pickerStyle?: StyleProp<TextStyle>,
  getDisplayValue: (value: ItemValue) => string,
  dataId: keyof TempDataState,
  items: (ItemValue | null)[]
};

export const NULL_PLACEHOLDER = "select";

// Render dropdown for web/Android, open picker modal for iOS
const Picker: FunctionComponent<PickerProps> = ({ style, pickerStyle, includePlaceholder, getDisplayValue, selectedValue, onValueChange, items, ...props }) => {
  const navigation = useNavigation<NavigatorProps>();

  const pickerItems = items.map((value) => (
    { value, label: getDisplayValue(value) }
  ));
  if (includePlaceholder) {
    pickerItems.unshift({ value: null, label: "Please select" });
  }

  return (
    Platform.OS === "ios" ? (
      <AnimatedPressable onPress={() => navigation.navigate(
        "PickerModal",
        {
          ...props,
          items: pickerItems,
          style: pickerStyle
        }
      )} style={styles.pressable}>
        <Ionicons name={"square-outline"} size={FontSize.SMALL_ICON} color={"transparent"} />
        <Text style={[styles.text, style]}>
          {!selectedValue ? "Please select" : getDisplayValue(selectedValue)}
        </Text>
        <Ionicons name={"chevron-down-outline"} size={FontSize.SMALL_ICON} />
      </AnimatedPressable>
    ) : (
      <PickerComponent
        style={pickerStyle}
        selectedValue={selectedValue}
        onValueChange={(value) => onValueChange(value === NULL_PLACEHOLDER ? null : value)}
        {...props}
      >
        {pickerItems.map(({ value, label }) => (
          <PickerComponent.Item
            label={label}
            value={value || NULL_PLACEHOLDER}
            key={value || NULL_PLACEHOLDER}
          />
        ))}
      </PickerComponent>
    )
  );
};

export default Picker;

const styles = StyleSheet.create({
  pressable: {
    flexDirection: "row",
    alignItems: "center"
  },
  text: {
    marginHorizontal: 5
  }
})