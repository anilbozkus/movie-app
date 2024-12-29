import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Card, CardContent, CardMedia } from "@mui/material";
import StarRateIcon from '@mui/icons-material/StarRate';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const Detail: React.FC = () => {
  const selectedMovie = useSelector((state: RootState) => state.movie.selectedMovie);
  const { imdbID } = useParams();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchDetails = async () => {
        try {
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=21a510c3&i=${selectedMovie ? selectedMovie.imdbID : imdbID}`
          );
          const data = await response.json();
          if (data.Response === "True") {
            setDetails(data);
          } else {
            alert(data.Error);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!details) {
    return <Typography variant="h6" align="center">Movie details not found.</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, boxShadow: 3 }}>
        <CardMedia
          component="img"
          sx={{
            width: { xs: '100%', sm: 300 },
            height: 'auto',
            objectFit: 'cover',
            borderRadius: 2,
            marginBottom: { xs: 2, sm: 0 }
          }}
          image={details.Poster}
          alt={details.Title}
        />

        <CardContent sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            {details.Title} ({details.Year})
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Genre:</strong> {details.Genre}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Director:</strong> {details.Director}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Cast:</strong> {details.Actors}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Duration:</strong> {details.Runtime}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StarRateIcon sx={{ color: '#FFD700', marginRight: 1 }} />
            <Typography variant="body1" color="text.secondary">
              <strong>IMDb Rating:</strong> {details.imdbRating}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
