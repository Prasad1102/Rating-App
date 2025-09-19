// frontend/src/pages/UserProfile.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../utils/api';
import { useAuth } from '../utils/AuthContext';
import { Box, Typography, Paper, TextField, Button, Alert } from '@mui/material';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [success, setSuccess] = React.useState('');
  const [error, setError] = React.useState('');

  const onSubmit = async (data) => {
    setError(''); setSuccess('');
    try {
      await api.put('/auth/password', { oldPassword: data.oldPassword, newPassword: data.newPassword });
      setSuccess('Password updated. Please login again.');
      setTimeout(() => { logout(); }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    }
    reset();
  };

  return (
    <Box p={3}>
      <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h5" mb={2}>Profile</Typography>
        <Typography>Name: {user?.name}</Typography>
        <Typography>Email: {user?.email}</Typography>
        <Typography>Role: {user?.role}</Typography>
        <Button variant="outlined" color="secondary" sx={{ mt: 2 }} onClick={logout}>Logout</Button>
        <Typography variant="h6" mt={3}>Change Password</Typography>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Old Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('oldPassword', { required: 'Old password required' })}
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('newPassword', {
              required: 'New password required',
              minLength: { value: 8, message: 'Min 8 chars' },
              maxLength: { value: 16, message: 'Max 16 chars' },
              validate: {
                upper: v => /[A-Z]/.test(v) || 'At least one uppercase',
                special: v => /[!@#$%^&*]/.test(v) || 'At least one special char'
              }
            })}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Update Password</Button>
        </form>
      </Paper>
    </Box>
  );
}
