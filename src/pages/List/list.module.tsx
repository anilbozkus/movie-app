import { useState, useEffect, MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { SelectChangeEvent } from '@mui/material';
import { Box, TextField, Button, Typography, Grid2, Pagination, Select, MenuItem, InputLabel, FormControl, Popover, IconButton, CircularProgress } from "@mui/material";
import { setSelectedMovie } from "../../redux/movieSlice";
import MovieCard from "../../components/MovieCard/MovieCard.module";
import './list.module.scss';

type Year = {
    value: string;
    label: string;
};

export const List: React.FC = () => {
  const [query, setQuery] = useState('war');
  const [releaseYear, setReleaseYear] = useState('');
  const [type, setType] = useState('');
  const [yearsData, setYearsData] = useState<Year[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch("/years.json");
        const data = await response.json();
        setYearsData(data.years);
      } catch (error) {
        console.error("Error fetching years data:", error);
      }
    };

    fetchYears();
  }, []);

  const fetchMovies = async (searchQuery: string, page: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=21a510c3&s=${searchQuery}&page=${page}&y=${releaseYear}&type=${type}`
      );
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search);
        setTotalPages(Math.ceil(Number(data.totalResults) / 10));
      } else {
        setMovies([]);
        alert(data.Error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(query, pageNumber);
  }, [pageNumber, releaseYear, type]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setPageNumber(1);
      fetchMovies(query, 1);
    } else {
      alert("Please enter a valid query.");
    }
  };

  const handlePageChange = (event: any, value: number) => {
    setPageNumber(value);
  };

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setReleaseYear(event.target.value);
  };

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleReset = () => {
    setReleaseYear('');
    setType('');
    handlePopoverClose();
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setType(event.target.value);
  };

  const handleMovieClick = (movie: any) => {
    dispatch(setSelectedMovie(movie));
    navigate(`/show-detail`);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'year-filter-popover' : undefined;

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3,
          gap: 2,
        }}
      >
        <TextField
          label="Search for a movie..."
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          sx={{ maxWidth: 400 }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>

        <IconButton onClick={handlePopoverOpen}>
          <FilterAltIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress />
        </Box>
      ) : movies && movies.length > 0 ? (
        <>
          <Grid2
            container
            columns={{ xs: 1, sm: 2, md: 4 }}
            spacing={2}
            justifyContent="center"
            className="list-container"
          >
            {movies.map((movie: any) => (
              <Grid2 onClick={() => handleMovieClick(movie)} sx={{ width: '300px', minHeight: '450px' }} key={movie.imdbID}>
                <MovieCard
                  title={movie.Title}
                  year={movie.Year}
                  poster={movie.Poster}
                  imdbID={movie.imdbID}
                />
              </Grid2>
            ))}
          </Grid2>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={pageNumber}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      ) : (
        <Typography align="center" variant="body1" color="text.secondary">
          No movies found. Try searching for something else.
        </Typography>
      )}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ minWidth: '250px', p: 3 }}>
          <Typography sx={{ marginBottom: '12px' }} variant="h6">
            Filters
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Release Year</InputLabel>
            <Select value={releaseYear} label="Release Year" onChange={handleYearChange}>
              <MenuItem value="">None</MenuItem>
              {yearsData?.map((year) => (
                <MenuItem key={year.value} value={year.value}>
                  {year.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select value={type} label="Type" onChange={handleTypeChange}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="movie">Movie</MenuItem>
              <MenuItem value="series">Series</MenuItem>
              <MenuItem value="episode">Episode</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="secondary" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};
