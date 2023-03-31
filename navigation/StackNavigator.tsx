import type { FunctionComponent } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import HomeScreen from "../pages/HomeScreen";
import MixScreen from "../pages/MixScreen";
import EditTrackSegmentScreen from "../pages/EditTrackSegmentScreen";

type StackNavigatorParamList = {
  Home: undefined,
  Mix: { mixId: string },
  EditTrackSegment: { mixId: string, trackIndex?: number }
};

export type NavigatorProps<T extends keyof StackNavigatorParamList>  = NativeStackScreenProps<StackNavigatorParamList, T>;

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
  </Stack.Navigator>
);

export default StackNavigator;