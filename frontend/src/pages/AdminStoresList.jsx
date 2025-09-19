// frontend/src/pages/AdminStoresList.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Box, Typography, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, CircularProgress, Alert } from '@mui/material';

export default function AdminStoresList() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ field: 'id', order: 'asc' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = { ...filters, sort: sort.field, order: sort.order, page, size: 10 };
      const res = await api.get('/admin/stores', { params });
      setStores(res.data.stores);
      setTotal(res.data.total);
      setError('');
    } catch (err) {
      setError('Failed to load stores');
    }
    setLoading(false);
  };

  useEffect(() => { fetchStores(); }, [filters, sort, page]);

  const handleSort = (field) => {
    setSort(s => ({ field, order: s.order === 'asc' ? 'desc' : 'asc' }));
  };

  const handleFilterChange = (e) => {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
    setPage(1);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Stores</Typography>
      <Box mb={2} display="flex" gap={2}>
        <TextField label="Name" name="name" value={filters.name} onChange={handleFilterChange} />
        <TextField label="Email" name="email" value={filters.email} onChange={handleFilterChange} />
        <TextField label="Address" name="address" value={filters.address} onChange={handleFilterChange} />
      </Box>
      {loading ? <CircularProgress /> :
        error ? <Alert severity="error">{error}</Alert> :
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['id', 'name', 'email', 'address', 'averageRating'].map(field => (
                  <TableCell key={field}>
                    <TableSortLabel
                      active={sort.field === field}
                      direction={sort.order}
                      onClick={() => handleSort(field)}
                    >{field}</TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map(store => (
                <TableRow key={store.id}>
                  <TableCell>{store.id}</TableCell>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>{store.email}</TableCell>
                  <TableCell>{store.address}</TableCell>
                  <TableCell>{store.averageRating || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
      <Box mt={2} display="flex" gap={2}>
        <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
        <Typography>Page {page}</Typography>
        <Button disabled={page * 10 >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
      </Box>
    </Box>
  );
}
