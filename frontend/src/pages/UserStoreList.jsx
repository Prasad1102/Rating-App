// frontend/src/pages/UserStoreList.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Box, Typography, Paper, TextField, Button, Rating, Alert, CircularProgress } from '@mui/material';

export default function UserStoreList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await api.get('/stores', { params: { search } });
      setStores(res.data.stores);
      setError('');
    } catch (err) {
      setError('Failed to load stores');
    }
    setLoading(false);
  };

  useEffect(() => { fetchStores(); }, []); // initial load

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleRate = async (storeId, value) => {
    setRatingSubmitting(true);
    try {
      await api.post(`/stores/${storeId}/rate`, { rating: value });
      fetchStores();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit rating');
    }
    setRatingSubmitting(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Stores</Typography>
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <TextField
          label="Search by name or address"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button type="submit" variant="contained">Search</Button>
      </form>
      {loading ? <CircularProgress /> :
        error ? <Alert severity="error">{error}</Alert> :
        stores.length === 0 ? <Typography>No stores found.</Typography> :
        stores.map(store => (
          <Paper key={store.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{store.name}</Typography>
            <Typography variant="body2">{store.address}</Typography>
            <Typography variant="body2">Average Rating: {store.averageRating || 'N/A'}</Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <Rating
                value={store.userRating || 0}
                max={5}
                onChange={(_, value) => handleRate(store.id, value)}
                disabled={ratingSubmitting}
              />
              <Typography ml={2}>{store.userRating ? `Your rating: ${store.userRating}` : 'Not rated'}</Typography>
            </Box>
          </Paper>
        ))
      }
    </Box>
  );
}
