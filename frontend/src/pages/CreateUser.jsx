// frontend/src/pages/CreateUser.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../utils/api';
import { Box, Button, TextField, Typography, Paper, Alert, Select, MenuItem } from '@mui/material';

export default function CreateUser() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [serverError, setServerError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const onSubmit = async (data) => {
    setServerError(''); setSuccess('');
    try {
      await api.post('/admin/users', data);
      setSuccess('User created');
      reset();
    } catch (err) {
      setServerError(err.response?.data?.error || (err.response?.data?.errors?.[0]) || 'Failed to create user');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2}>Create User</Typography>
        {serverError && <Alert severity="error">{serverError}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register('name', { required: 'Name required', minLength: { value: 20, message: 'Min 20 chars' }, maxLength: { value: 60, message: 'Max 60 chars' } })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email', { required: 'Email required', pattern: { value: /.+@.+\..+/, message: 'Invalid email' } })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', {
              required: 'Password required',
              minLength: { value: 8, message: 'Min 8 chars' },
              maxLength: { value: 16, message: 'Max 16 chars' },
              validate: {
                upper: v => /[A-Z]/.test(v) || 'At least one uppercase',
                special: v => /[!@#$%^&*]/.test(v) || 'At least one special char'
              }
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            {...register('address', { required: 'Address required', maxLength: { value: 400, message: 'Max 400 chars' } })}
            error={!!errors.address}
            helperText={errors.address?.message}
          />
          <Select
            fullWidth
            defaultValue="USER"
            {...register('role', { required: 'Role required' })}
            sx={{ mt: 2 }}
          >
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="OWNER">OWNER</MenuItem>
          </Select>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Create User</Button>
        </form>
      </Paper>
    </Box>
  );
}
