import delicate from "./files/delicate.mp3";
import dontBlameMe from "./files/dont_blame_me.mp3";
import usedToKnowMe from "./files/used_to_know_me.mp3";

const Tracks: StringToTypeMap<TrackMetadata> = {
  track1: {
    title: "Delicate",
    artist: "Taylor Swift",
    url: delicate,
    color: "orange1"
  },
  track2: {
    title: "Don't Blame Me",
    artist: "Taylor Swift",
    url: dontBlameMe,
    color: "blue1"
  },
  track3: {
    title: "Used To Know Me",
    artist: "Charli XCX",
    url: usedToKnowMe,
    color: "purple1"
  }
};

export default Tracks;