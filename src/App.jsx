import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import CashierDashboard from './pages/Cashier/Dashboard';
import CreateSale from './pages/Cashier/CreateSale';
import MySales from './pages/Cashier/MySales';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);

  const PrivateRoute = ({ children, roles }) => {
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Cashier Routes */}
      <Route
        path="/cashier/dashboard"
        element={
          <PrivateRoute roles={['CASHIER']}>
            <CashierDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/cashier/create-sale"
        element={
          <PrivateRoute roles={['CASHIER']}>
            <CreateSale />
          </PrivateRoute>
        }
      />
      <Route
        path="/cashier/my-sales"
        element={
          <PrivateRoute roles={['CASHIER']}>
            <MySales />
          </PrivateRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
