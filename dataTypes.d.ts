type TrackMetadata = {
  title: string,
  artist: string,
  url: string,
  color: string
};

type TrackSegment = {
  id: string,
  start: number,
  end: number
}

type Mix = {
  title: string,
  team: string,
  image: string,
  tracks: TrackSegment[]
};

type MixWithId = Mix & {
  id: string
};