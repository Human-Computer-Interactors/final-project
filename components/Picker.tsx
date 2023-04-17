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
import type { NavigatorProps, RouteProps } from "../navigation/StackNavigator";
import AnimatedPressable from "./AnimatedPressable";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontSize } from "../types/Layout";

type PickerProps = Omit<PickerComponentProps, "style" | "selectedValue" | "children"> & {
  selectedValue: string,
  style?: StyleProp<TextStyle>
  pickerStyle?: StyleProp<TextStyle>,
  getDisplayValue: (value: number | string) => string,
  pickerId: string,
  items: { label: string, value: string }[]
}

// Render dropdown for web/Android, open picker modal for iOS
const Picker: FunctionComponent<PickerProps> = ({ style, pickerStyle, getDisplayValue, selectedValue, onValueChange, items, ...props }) => {
  const navigation = useNavigation<NavigatorProps>();
  const { name, params } = useRoute<RouteProps>();
  return (
    Platform.OS === "ios" ? (
      <AnimatedPressable onPress={() => navigation.navigate(
        // @ts-ignore
        "PickerModal",
        {
          ...props,
          items,
          selectedValue,
          style: pickerStyle,
          previousPage: name
        }
      )} style={styles.pressable}>
        <Ionicons name={"square-outline"} size={FontSize.SMALL_ICON} color={"transparent"} />
        <Text style={[styles.text, style]}>{getDisplayValue(selectedValue)}</Text>
        <Ionicons name={"chevron-down-outline"} size={FontSize.SMALL_ICON} />
      </AnimatedPressable>
    ) : (
      <PickerComponent
        style={pickerStyle}
        selectedValue={selectedValue}
        {...props}
      >
        {items.map(({ label, value }) => (
          <PickerComponent.Item label={label} value={value} key={value} />
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