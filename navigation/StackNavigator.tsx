import type { FunctionComponent } from "react";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
  NativeStackNavigationProp
} from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import type { PickerProps } from "@react-native-picker/picker";
import HomeScreen from "../pages/HomeScreen";
import MixScreen from "../pages/MixScreen";
import EditTrackSegmentScreen from "../pages/EditTrackSegmentScreen";
import PickerModalScreen from "../pages/PickerModalScreen";
import type { ItemValue } from "@react-native-picker/picker/typings/Picker";
import type { TempDataState } from "../redux/slices/tempDataSlice";

type StackNavigatorParamList = {
  Home: undefined,
  Mix: { mixId: string },
  EditTrackSegment: { mixId: string, trackIndex?: number },
  PickerModal: Omit<PickerProps, "onValueChange" | "selectedValue" | "children"> & {
    dataId: keyof TempDataState,
    items: { label: string, value: ItemValue | null }[]
  }
};

export type ScreenProps<T extends keyof StackNavigatorParamList> = NativeStackScreenProps<StackNavigatorParamList, T>;
export type NavigatorProps = NativeStackNavigationProp<StackNavigatorParamList>;
export type RouteProps = RouteProp<StackNavigatorParamList>;

const Stack = createNativeStackNavigator<StackNavigatorParamList>();

const StackNavigator: FunctionComponent = () => (
  <Stack.Navigator initialRouteName={"Home"} screenOptions={{ headerShown: false }}>
    <Stack.Screen name={"Home"} component={HomeScreen} />
    <Stack.Screen name={"Mix"} component={MixScreen} />
    <Stack.Screen
      name={"EditTrackSegment"}
      component={EditTrackSegmentScreen}
      options={{ presentation: "transparentModal" }}
    />
    <Stack.Screen
      name={"PickerModal"}
      component={PickerModalScreen}
      options={{ presentation: "transparentModal" }}
    />
  </Stack.Navigator>
);

export default StackNavigator;