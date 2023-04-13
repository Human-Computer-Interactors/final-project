import registerRootComponent from 'expo/build/launch/registerRootComponent';
import App from "./App";
import { PlaybackService } from "./services/PlaybackService";
import TrackPlayer from "react-native-track-player";

registerRootComponent(App);
TrackPlayer.registerPlaybackService(() => PlaybackService);