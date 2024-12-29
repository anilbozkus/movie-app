import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Movie = {
  Title: string;
  Year: string;
  Poster: string;
  imdbID: string;
};

interface MovieState {
  selectedMovie: Movie | null;
}

const initialState: MovieState = {
  selectedMovie: null,
};

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setSelectedMovie: (state, action: PayloadAction<Movie>) => {
      state.selectedMovie = action.payload;
    },
  },
});

export const { setSelectedMovie } = movieSlice.actions;
export default movieSlice.reducer;
