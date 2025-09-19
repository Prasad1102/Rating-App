// frontend/src/pages/AdminUsersList.jsx
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Box, Typography, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Select, MenuItem, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function AdminUsersList() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ field: 'id', order: 'asc' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { ...filters, sort: sort.field, order: sort.order, page, size: 10 };
      const res = await api.get('/admin/users', { params });
      setUsers(res.data.users);
      setTotal(res.data.total);
      setError('');
    } catch (err) {
      setError('Failed to load users');
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [filters, sort, page]);

  const handleSort = (field) => {
    setSort(s => ({ field, order: s.order === 'asc' ? 'desc' : 'asc' }));
  };

  const handleFilterChange = (e) => {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const handleRowClick = async (user) => {
    try {
      const res = await api.get(`/admin/users/${user.id}`);
      setSelectedUser(res.data);
    } catch {
      setSelectedUser(null);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Users</Typography>
      <Box mb={2} display="flex" gap={2}>
        <TextField label="Name" name="name" value={filters.name} onChange={handleFilterChange} />
        <TextField label="Email" name="email" value={filters.email} onChange={handleFilterChange} />
        <TextField label="Address" name="address" value={filters.address} onChange={handleFilterChange} />
        <Select name="role" value={filters.role} onChange={handleFilterChange} displayEmpty>
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="ADMIN">ADMIN</MenuItem>
          <MenuItem value="USER">USER</MenuItem>
          <MenuItem value="OWNER">OWNER</MenuItem>
        </Select>
      </Box>
      {loading ? <CircularProgress /> :
        error ? <Alert severity="error">{error}</Alert> :
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['id', 'name', 'email', 'address', 'role'].map(field => (
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
              {users.map(user => (
                <TableRow key={user.id} hover onClick={() => handleRowClick(user)} style={{ cursor: 'pointer' }}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.role}</TableCell>
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
      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <Typography>Name: {selectedUser.name}</Typography>
              <Typography>Email: {selectedUser.email}</Typography>
              <Typography>Address: {selectedUser.address}</Typography>
              <Typography>Role: {selectedUser.role}</Typography>
              {selectedUser.role === 'OWNER' && selectedUser.stores && (
                <>
                  <Typography mt={2} fontWeight="bold">Stores:</Typography>
                  {selectedUser.stores.map(store => (
                    <Typography key={store.id}>{store.name} (Avg Rating: {store.averageRating || 'N/A'})</Typography>
                  ))}
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
