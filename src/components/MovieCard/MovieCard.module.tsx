import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import './MovieCard.module.scss';

interface MovieCardProps {
  title: string;
  year: string;
  poster: string;
  imdbID: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, year, poster, imdbID }) => {
  return (
    <Card sx={{minHeight: '425px', cursor: 'pointer'}}>
      <CardMedia
        component="img"
        alt={title}
        height="300"
        image={poster !== "N/A" ? poster : "/placeholder.png"}
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {year}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        imdbID - {imdbID}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
