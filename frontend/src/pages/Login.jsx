// frontend/src/pages/Login.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../utils/AuthContext';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';

export default function Login() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState('');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const res = await api.post('/auth/login', data);
      login(res.data);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2}>Login</Typography>
        {serverError && <Alert severity="error">{serverError}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
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
            {...register('password', { required: 'Password required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
          <Button onClick={() => navigate('/register')} fullWidth sx={{ mt: 1 }}>Register</Button>
        </form>
      </Paper>
    </Box>
  );
}
