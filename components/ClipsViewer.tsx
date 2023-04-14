import { useEffect, useRef, useState, useMemo } from "react";
import {
	View,
	StyleSheet,
	FlatList,
	useWindowDimensions,
	Animated,
	Easing,
} from "react-native";
import { useAppSelector } from "../redux/hooks";
import type { FunctionComponent } from "react";
import { Colors } from "../types/Colors";
import { range, prefixSums } from "../utilities";

type ClipsViewerProps = {
	currentTrack: number;
	selectedMode: boolean;
	playing: boolean;
	playTimer: NodeJS.Timeout | null;
	mixId: string;
	pause: () => void;
	skipTo: (
		position: number,
		relative: boolean,
		timeOffset: number,
		startPlaying: boolean
	) => void;
};

const ONE_SECOND_WIDTH = 5;

const ClipsViewer: FunctionComponent<ClipsViewerProps> = ({
	currentTrack,
	selectedMode,
	playing,
	playTimer,
	mixId,
	pause,
	skipTo,
}) => {
	const scrollRef = useRef<FlatList>(null);
	const scrollAnimation = useRef<Animated.Value>(new Animated.Value(0));
	const [contentWidth, setContentWidth] = useState<number>(0);
	const [scrollOffset, setScrollOffset] = useState<number>(0);
	const [wasPlaying, setWasPlaying] = useState<boolean>(false);
	const [isDrag, setIsDrag] = useState<boolean>(false);
	const [scrollTimer, setScrollTimer] = useState<NodeJS.Timeout | null>(null);

	const trackSegments = useAppSelector(({ mixes }) => mixes[mixId].tracks);
	const tracks = useAppSelector(({ tracks }) => tracks);
	const { width } = useWindowDimensions();

	const trackOffsets = useMemo<number[]>(
		() =>
			prefixSums(
				trackSegments.map(({ start, end }) => (end - start) * ONE_SECOND_WIDTH)
			),
		[trackSegments]
	);

	// Find the current track segment based on scroll position
	const getScrollLocation = (slop: number = 0) => {
		let index = trackOffsets.findIndex(
			(pos, i) =>
				pos <= scrollOffset + slop &&
				i + 1 < trackOffsets.length &&
				trackOffsets[i + 1] > scrollOffset + slop
		);
		// Set to first or last segment if user over-scrolls
		if (index === -1) {
			index = scrollOffset < 0 ? 0 : trackSegments.length - 1;
		}
		return index;
	};

	const beginScrollInterrupt = () => {
		scrollAnimation.current.stopAnimation();
		setWasPlaying(playing);
		setIsDrag(true);
		pause();
	};

	const endScrollInterrupt = () => {
		if (!isDrag) return;
		const index = getScrollLocation();
		// Find offset from start of segment in seconds based on scroll position
		const timeOffset = Math.min(
			Math.max(
				(scrollOffset - trackOffsets[index]) / ONE_SECOND_WIDTH,
				0 // Set to 0 if user over-scrolls to the left (on first track)
			),
			trackSegments[index].end // Set to end if user over-scrolls on right (on last track)
		);
		skipTo(index, false, timeOffset, wasPlaying);
		setIsDrag(false);
	};

	const scrollEndDrag = () => {
		const timerId = setTimeout(endScrollInterrupt, 100);
		setScrollTimer(timerId);
	};

	const playingAnimation = (offset: number = scrollOffset) =>
		Animated.sequence(
			range(
				Math.floor((contentWidth - width - offset) / ONE_SECOND_WIDTH),
				offset + ONE_SECOND_WIDTH,
				ONE_SECOND_WIDTH
			).map((value) =>
				Animated.timing(scrollAnimation.current, {
					toValue: value,
					duration: 1000,
					useNativeDriver: true,
					easing: Easing.linear,
				})
			)
		);

	const skippingAnimation = () =>
		Animated.timing(scrollAnimation.current, {
			toValue: trackOffsets[currentTrack],
			duration: 300,
			useNativeDriver: true,
			easing: Easing.inOut(Easing.ease),
		});

	const skip = () => {
		const animations = [skippingAnimation()];
		if (playing) {
			scrollAnimation.current.stopAnimation();
			animations.push(playingAnimation(trackOffsets[currentTrack]));
		}
		Animated.sequence(animations).start();
	};

	useEffect(() => {
		scrollAnimation.current.addListener((animation) => {
			scrollRef.current?.scrollToOffset({
				offset: animation.value,
				animated: false,
			});
		});
		return () => scrollAnimation.current.removeAllListeners();
	}, []);

	useEffect(() => {
		if (contentWidth) {
			if (playing) {
				scrollAnimation.current.removeAllListeners();
				scrollAnimation.current = new Animated.Value(scrollOffset);
				scrollAnimation.current.addListener((animation) => {
					scrollRef.current?.scrollToOffset({
						offset: animation.value,
						animated: false,
					});
				});
				playingAnimation().start();
			} else {
				scrollAnimation.current.stopAnimation();
			}
		}
	}, [contentWidth, playing]);

	useEffect(() => {
		// Skip to different track
		if (getScrollLocation() !== currentTrack) {
			skip();
		}
	}, [currentTrack]);

	useEffect(() => {
		// Skip back to beginning if track is being looped
		if (selectedMode && getScrollLocation(ONE_SECOND_WIDTH) > currentTrack) {
			skip();
		}
	}, [playTimer]);

	return (
		<View style={styles.container}>
			<View style={[styles.pointer, { left: width / 2 }]} />
			<Animated.FlatList
				style={{ width }}
				ref={scrollRef}
				horizontal
				showsHorizontalScrollIndicator={false}
				onContentSizeChange={(width) => setContentWidth(width)}
				onScrollBeginDrag={beginScrollInterrupt}
				onScrollEndDrag={scrollEndDrag}
				onMomentumScrollBegin={() => clearTimeout(scrollTimer)}
				onMomentumScrollEnd={endScrollInterrupt}
				onScroll={({ nativeEvent }) =>
					setScrollOffset(nativeEvent.contentOffset.x)
				}
				contentContainerStyle={styles.contentContainer}
				data={trackSegments}
				keyExtractor={(segment) =>
					`${segment.id}-${segment.start}-${segment.end}`
				}
				renderItem={({ item, index }) => (
					<View
						style={[
							styles.trackSegment,
							{
								width: ONE_SECOND_WIDTH * (item.end - item.start),
								backgroundColor:
									!selectedMode || currentTrack === index
										? Colors[tracks[item.id].color]
										: "#a4a4a4",
							},
						]}
					/>
				)}
			/>
		</View>
	);
};

export default ClipsViewer;

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
	},
	pointer: {
		position: "absolute",
		height: "100%",
		width: 2,
		backgroundColor: "#000",
		zIndex: 100,
	},
	contentContainer: {
		flexDirection: "row",
		paddingHorizontal: "50%",
	},
	trackSegment: {
		backgroundColor: "#fff",
		height: 150,
		marginVertical: 50,
		borderWidth: 1,
	},
});
