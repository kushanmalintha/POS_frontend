import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import './Dashboard.css';

const CashierDashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="dashboard-main">
          <h1>Welcome Cashier!</h1>
          <p>Use the sidebar to navigate to create a sale or view your sales.</p>
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;
