import { configureStore } from "@reduxjs/toolkit";
import mixesReducer from "./mixesSlice";
import tracksReducer from "./tracksSlice";

const store = configureStore({
  reducer: {
    mixes: mixesReducer,
    tracks: tracksReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;