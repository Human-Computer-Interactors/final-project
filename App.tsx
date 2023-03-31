import type { FunctionComponent } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import StackNavigator from "./navigation/StackNavigator";
import store from "./redux/store";
import linking from "./navigation/linking";
import "setimmediate";

const App: FunctionComponent = () => {
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