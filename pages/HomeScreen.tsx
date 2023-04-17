import type { FunctionComponent } from "react";
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	ListRenderItemInfo,
	Image,
} from "react-native";
import MixCard from "../components/MixCard";
import { FontSize } from "../types/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ScreenProps } from "../navigation/StackNavigator";
import IconButton from "../components/IconButton";
import { objectToArray } from "../utilities";
import { useAppSelector } from "../redux/hooks";

type HomeScreenProps = ScreenProps<"Home">;

const HomeScreen: FunctionComponent<HomeScreenProps> = ({ navigation }) => {
	const mixes: MixWithId[] = useAppSelector(({ mixes }) =>
		objectToArray<Mix>(mixes)
	);
	const { top, bottom } = useSafeAreaInsets();

	// TODO: Add album cover
	const albumCover = null;

	return (
		<View style={styles.container}>
			<View style={styles.logoContainer}>
				<Image
					source={albumCover ? albumCover : require("../assets/Logo.png")}
					style={styles.logo}
				/>
			</View>
			<View style={styles.mainContent}>
				<FlatList
					ListHeaderComponent={() => <Text style={styles.title}>Mixes</Text>}
					contentContainerStyle={[
						styles.mixesContainer,
						{ paddingTop: top + 10 },
					]}
					data={mixes}
					renderItem={({ item }: ListRenderItemInfo<MixWithId>) => (
						<MixCard
							navigation={navigation}
							{...item}
							image={require("../assets/album_placeholder.jpeg")}
						/>
					)}
					keyExtractor={(mix) => mix.id}
				/>
			</View>
			<IconButton
				style={{ ...styles.addButton }}
				iconName={"add"}
				iconColor={"#fff"}
				iconStyle={styles.addIcon}
			/>
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		position: "relative",
		display: "flex",
		flex: 1,
		backgroundColor: "transparent",
		backgroundImage: "linear-gradient(to bottom, #292929, #0D252D)",
	},
	logoContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		width: 60,
		height: 60,
		margin: 30,
	},
	logo: {
		width: "100%",
		height: "100%",
		resizeMode: "contain",
	},
	mainContent: {
		marginTop: 50,
	},
	title: {
		display: "flex",
		alignSelf: "center",
		width: "fit-content",
		alignItems: "center",
		fontSize: FontSize.HEADER,
		textAlign: "center",
		marginBottom: 10,
		color: "#fff",
		paddingVertical: 7,
		paddingHorizontal: 30,
		backgroundColor: "#32333E",
	},
	mixesContainer: {
		margin: 30,
		display: "flex",
		gap: 15,
	},
	addButton: {
		position: "absolute",
		right: 30,
		bottom: 30,
		backgroundColor: "#758A8D",
		width: 80,
		height: 80,
		borderRadius: 10000,
	},
	addIcon: {
		marginLeft: 3,
	},
});
