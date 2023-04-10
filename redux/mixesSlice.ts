import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import uuid from "react-native-uuid";
import { shallowEqual } from "../utilities";
import mixesData from "../data/mixes";

type MixesState = StringToTypeMap<Mix>;

const initialState: MixesState = mixesData;

export const mixesSlice = createSlice({
  name: "mixes",
  initialState,
  reducers: {
    addMix: (state, action: PayloadAction<Mix>) => {
      state[uuid.v4().toString()] = action.payload;
    },
    deleteMix: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    addTrackSegment: (state, action: PayloadAction<TrackSegment & { mixId: string }>) => {
      const { mixId, ...track } = action.payload;
      state[mixId].tracks.push(track);
    },
    editTrackSegment: (state, action: PayloadAction<TrackSegment & { mixId: string, trackIndex: number }>) => {
      const { mixId, trackIndex, ...track } = action.payload;
      state[mixId].tracks[trackIndex] = track;
    },
    reorderTracks: (state, action: PayloadAction<{ mixId: string, tracks: TrackSegment[] }>) => {
      const { mixId, tracks } = action.payload;
      state[mixId].tracks = tracks;
    },
    deleteTrackSegment: (state, action: PayloadAction<TrackSegment & { mixId: string }>) => {
      const { mixId, ...track } = action.payload;
      state[mixId].tracks = state[mixId].tracks.filter((segment) => !shallowEqual(segment, track));
    }
  }
});

export const { addMix, deleteMix, addTrackSegment, editTrackSegment, reorderTracks, deleteTrackSegment } = mixesSlice.actions;

export default mixesSlice.reducer;