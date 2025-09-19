// frontend/src/pages/CreateStore.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../utils/api';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';

export default function CreateStore() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [serverError, setServerError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const onSubmit = async (data) => {
    setServerError(''); setSuccess('');
    try {
      await api.post('/admin/stores', data);
      setSuccess('Store created');
      reset();
    } catch (err) {
      setServerError(err.response?.data?.error || (err.response?.data?.errors?.[0]) || 'Failed to create store');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2}>Create Store</Typography>
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
            label="Address"
            fullWidth
            margin="normal"
            {...register('address', { required: 'Address required', maxLength: { value: 400, message: 'Max 400 chars' } })}
            error={!!errors.address}
            helperText={errors.address?.message}
          />
          <TextField
            label="Owner ID (optional)"
            fullWidth
            margin="normal"
            {...register('ownerId', { pattern: { value: /^\d*$/, message: 'Must be a number' } })}
            error={!!errors.ownerId}
            helperText={errors.ownerId?.message}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Create Store</Button>
        </form>
      </Paper>
    </Box>
  );
}
