import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('qflow_token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('qflow_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error('[Auth] Failed to restore session:', error);
          localStorage.removeItem('qflow_token');
          localStorage.removeItem('qflow_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Save session helper
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('qflow_token', userData.token);
    localStorage.setItem('qflow_user', JSON.stringify(userData));
  };

  // Customer Login
  const loginCustomer = async (email, password) => {
    try {
      const res = await api.post('/auth/customer/login', { email, password });
      if (res.data.success) {
        handleAuthSuccess(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to login';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Customer Register
  const registerCustomer = async (data) => {
    try {
      const res = await api.post('/auth/customer/register', data);
      if (res.data.success) {
        handleAuthSuccess(res.data.user);
        toast.success('Account created successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Business Login
  const loginBusiness = async (email, password) => {
    try {
      const res = await api.post('/auth/business/login', { email, password });
      if (res.data.success) {
        handleAuthSuccess(res.data.user);
        toast.success(`Welcome back, ${res.data.user.businessName || res.data.user.name}!`);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to login as business';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Business Register
  const registerBusiness = async (data) => {
    try {
      const res = await api.post('/auth/business/register', data);
      if (res.data.success) {
        handleAuthSuccess(res.data.user);
        toast.success('Business registered successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register business';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update Profile
  const updateProfile = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Profile updated successfully');
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('qflow_token');
    localStorage.removeItem('qflow_user');
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
  };

  const isBusiness = user?.role === 'business';
  const isCustomer = user?.role === 'customer';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isBusiness,
        isCustomer,
        loginCustomer,
        registerCustomer,
        loginBusiness,
        registerBusiness,
        updateProfile,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
