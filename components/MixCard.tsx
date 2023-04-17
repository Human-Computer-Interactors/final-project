import type { FunctionComponent } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import AnimatedPressable from "./AnimatedPressable";
import { FontSize } from "../types/Layout";
import type { NavigatorProps } from "../navigation/StackNavigator";
import { useAppSelector } from "../redux/hooks";
import { Colors } from "../types/Colors";

type MixCardProps = MixWithId & Pick<NavigatorProps<"Home">, "navigation">;

const MixCard: FunctionComponent<MixCardProps> = ({
	id,
	title,
	team,
	tracks,
	image,
	navigation,
}) => {
	const trackData = useAppSelector(({ tracks }) => tracks);
	const uniqueTracks = Object.keys(trackData).filter(
		(trackId) => tracks.findIndex(({ id }) => id === trackId) >= 0
	);
	return (
		<AnimatedPressable
			style={styles.card}
			onPress={() => navigation.navigate("Mix", { mixId: id })}
		>
			<View style={styles.sections}>
				<View style={styles.albumImageContainer}>
					<Image source={{ uri: image }} style={styles.album} />
				</View>
				<View style={styles.content}>
					<View style={styles.header}>
						<Text style={styles.title}>{title}</Text>
						<Text style={styles.artist}>{team}</Text>
					</View>
					<View style={styles.labels}>
						{uniqueTracks.map((id) => {
							const track = trackData[id];
							return (
								<View
									key={id}
									style={[
										styles.labelContainer,
										{ backgroundColor: Colors[track.color] },
									]}
								>
									<Text style={styles.labelText}>{track.title}</Text>
								</View>
							);
						})}
					</View>
				</View>
			</View>
		</AnimatedPressable>
	);
};

export default MixCard;

const styles = StyleSheet.create({
	card: {
		// display: "flex",
		// flexdi
		borderColor: "#DAF4E4",
		borderWidth: 0.5,
		// padding: 10,
		borderRadius: 5,
	},
	albumImageContainer: {
		overflow: "hidden",
		width: 100,
		height: 100,
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
	},
	album: {
		width: "100%",
		height: "100%",
	},
	sections: {
		display: "flex",
		flexDirection: "row",
		padding: 0,
		margin: 0,
	},
	content: {
		display: "flex",
		flexDirection: "column",
		margin: 10,
		flex: 1,
	},
	header: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
		justifyContent: "space-between",
	},
	title: {
		fontSize: FontSize.TITLE,
		color: "#fff",
	},
	artist: {
		fontSize: FontSize.BODY,
		fontStyle: "italic",
		color: "#BAAEAE",
	},
	labels: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 5,
	},
	labelContainer: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 10,
	},
	labelText: {
		color: "#fff",
		fontSize: 12,
	},
});
