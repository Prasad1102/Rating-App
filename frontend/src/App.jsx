// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserStoreList from './pages/UserStoreList';
import UserProfile from './pages/UserProfile';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersList from './pages/AdminUsersList';
import AdminStoresList from './pages/AdminStoresList';
import CreateUser from './pages/CreateUser';
import CreateStore from './pages/CreateStore';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './utils/AuthContext';

function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute roles={['USER', 'OWNER', 'ADMIN']}>
            {user?.role === 'USER' && <UserStoreList />}
            {user?.role === 'OWNER' && <OwnerDashboard />}
            {user?.role === 'ADMIN' && <AdminDashboard />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute roles={['USER', 'OWNER', 'ADMIN']}>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminUsersList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <AdminStoresList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-user"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <CreateUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-store"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <CreateStore />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
    </Routes>
  );
}

export default App;
