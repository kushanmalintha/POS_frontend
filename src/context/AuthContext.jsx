import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = async (username, password) => {
    const res = await loginApi({ username, password });
    const { token, role, username: name } = res.data;
    setToken(token);
    setUser({ username: name, role });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ username: name, role }));
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else navigate('/cashier/dashboard');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
