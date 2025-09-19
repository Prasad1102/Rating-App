// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data);
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
      <Typography variant="h4" mb={2}>Admin Dashboard</Typography>
      {loading ? <CircularProgress /> :
        error ? <Alert severity="error">{error}</Alert> :
        <Paper sx={{ p: 3, maxWidth: 400 }}>
          <Typography>Total Users: {data?.totalUsers}</Typography>
          <Typography>Total Stores: {data?.totalStores}</Typography>
          <Typography>Total Ratings: {data?.totalRatings}</Typography>
        </Paper>
      }
    </Box>
  );
}
