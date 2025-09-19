// frontend/src/pages/OwnerDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, CircularProgress, Alert } from '@mui/material';

export default function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/owner/dashboard');
        setStores(res.data.stores);
        setError('');
      } catch (err) {
        setError('Failed to load dashboard');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Owner Dashboard</Typography>
      {loading ? <CircularProgress /> :
        error ? <Alert severity="error">{error}</Alert> :
        stores.length === 0 ? <Typography>No stores found.</Typography> :
        stores.map(store => (
          <Paper key={store.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{store.name}</Typography>
            <Typography>Average Rating: {store.averageRating || 'N/A'}</Typography>
            <Typography mt={1} fontWeight="bold">User Ratings:</Typography>
            <List>
              {store.ratings.length === 0 ? <ListItem><ListItemText primary="No ratings yet." /></ListItem> :
                store.ratings.map(r => (
                  <ListItem key={r.userId} divider>
                    <ListItemText primary={`${r.name} (${r.email})`} secondary={`Rating: ${r.rating}`} />
                  </ListItem>
                ))}
            </List>
          </Paper>
        ))
      }
    </Box>
  );
}
