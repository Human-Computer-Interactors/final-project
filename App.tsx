import type { FunctionComponent } from "react";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import StackNavigator from "./navigation/StackNavigator";
import TrackPlayer, { Capability } from "react-native-track-player";
import store from "./redux/store";
import linking from "./navigation/linking";
import "expo-dev-client";
import "setimmediate";

const App: FunctionComponent = () => {
  useEffect(() => {
    const setupTrackPlayer = async () => {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause
        ],
        compactCapabilities: [Capability.Play, Capability.Pause]
      })
    };
    setupTrackPlayer();
  }, []);
  return (
    <NavigationContainer linking={linking}>
      <Provider store={store}>
        <StatusBar style={"auto"} />
        <StackNavigator />
      </Provider>
    </NavigationContainer>
  );
};

export default App;