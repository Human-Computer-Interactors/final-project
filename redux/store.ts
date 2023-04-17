import { configureStore } from "@reduxjs/toolkit";
import mixesReducer from "./slices/mixesSlice";
import tracksReducer from "./slices/tracksSlice";
import tempDataReducer from "./slices/tempDataSlice";

const store = configureStore({
  reducer: {
    mixes: mixesReducer,
    tracks: tracksReducer,
    tempData: tempDataReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;