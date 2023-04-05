import type { FunctionComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  Pressable
} from "react-native";
import MixCard from "../components/MixCard";
import { FontSize } from "../types/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NavigatorProps } from "../navigation/StackNavigator";
import IconButton from "../components/IconButton";
import { objectToArray } from "../utilities";
import { useAppSelector } from "../redux/hooks";

type HomeScreenProps = NavigatorProps<"Home">;

const HomeScreen: FunctionComponent<HomeScreenProps> = ({ navigation }) => {
  const mixes: MixWithId[] = useAppSelector(
    ({ mixes }) => objectToArray<Mix>(mixes)
  );
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={() => <Text style={styles.title}>Mixes</Text>}
        contentContainerStyle={[styles.mixesContainer, { paddingTop: top + 10 }]}
        data={mixes}
        renderItem={({ item }: ListRenderItemInfo<MixWithId>) => (
          <MixCard navigation={navigation} {...item} />
        )}
        keyExtractor={(mix) => mix.id}
      />
      <IconButton
        style={{ ...styles.addButton, bottom: bottom + 10 }}
        iconName={"add"}
        iconColor={"#fff"}
        iconStyle={styles.addIcon}
      />
    </View>
  )
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.HEADER,
    textAlign: "center",
    marginBottom: 10
  },
  mixesContainer: {
    padding: 20
  },
  addButton: {
    position: "absolute",
    right: 20,
    backgroundColor: "#000",
    width: 50,
    height: 50,
    borderRadius: 10000
  },
  addIcon: {
    marginLeft: 3
  }
})