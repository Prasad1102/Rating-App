// frontend/src/pages/Register.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';

export default function Register() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const [serverError, setServerError] = React.useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await api.post('/auth/register', data);
      navigate('/login');
    } catch (err) {
      setServerError(err.response?.data?.error || (err.response?.data?.errors?.[0]) || 'Registration failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2}>Register</Typography>
        {serverError && <Alert severity="error">{serverError}</Alert>}
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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>
          <Button onClick={() => navigate('/login')} fullWidth sx={{ mt: 1 }}>Back to Login</Button>
        </form>
      </Paper>
    </Box>
  );
}
