import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TempDataState = {
  trackSegmentTrackId: string | null
};

type SetDataFieldAction = {
  key: keyof TempDataState,
  value: number | string | null
};

const initialState: TempDataState = {
  trackSegmentTrackId: null
};

// Used to pass data across screens (like from picker)
export const tempDataSlice = createSlice({
  name: "tempData",
  initialState,
  reducers: {
    setDataField: (state, action: PayloadAction<SetDataFieldAction>) => {
      const { key, value } = action.payload;
      state[key] = value as TempDataState[typeof key];
    }
  }
});

export const { setDataField } = tempDataSlice.actions;

export default tempDataSlice.reducer;