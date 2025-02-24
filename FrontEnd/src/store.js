import { configureStore } from "@reduxjs/toolkit";
import impDetailsReducer from "./reducer/impDetails.js";
export const store = configureStore({
  reducer: {
    impDetailsStoreKey: impDetailsReducer,
  },
});
