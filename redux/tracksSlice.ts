import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import uuid from "react-native-uuid";
import tracksData from "../data/tracks.json";

type TracksState = StringToTypeMap<Track>;

const initialState: TracksState = tracksData;

export const tracksSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    addTrack: (state, action: PayloadAction<Track>) => {
      state[uuid.v4().toString()] = action.payload;
    },
    deleteTrack: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    editTrack: (state, action: PayloadAction<Partial<Track> & { id: string }>) => {
      const { id, ...track } = action.payload;
      state[id] = { ...state[id], ...track };
    }
  }
});

export const { addTrack, deleteTrack, editTrack } = tracksSlice.actions;

export default tracksSlice.reducer;