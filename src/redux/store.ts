import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieSlice';

export const store = configureStore({
  reducer: {
    movie: movieReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
