import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getCategories } from '../../api/categoryApi';
import { getProducts } from '../../api/productApi';
import { getAllUsers } from '../../api/userApi';
import { getAllSales } from '../../api/saleApi';
import './Dashboard.css';

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes, userRes, salesRes] = await Promise.all([
          getCategories(),
          getProducts(),
          getAllUsers(),
          getAllSales()
        ]);
        
        setCategories(catRes.data);
        setProducts(prodRes.data);
        setUsers(userRes.data);
        setSales(salesRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total revenue
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

  // Calculate low stock products
  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="dashboard-main">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Admin Dashboard</h1>
              <p className="dashboard-subtitle">Welcome back! Here's what's happening with your store today.</p>
            </div>
            <div className="dashboard-date">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner-large"></div>
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                {/* Total Revenue Card */}
                <div className="stat-card revenue-card">
                  <div className="stat-icon-wrapper purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-label">Total Revenue</h3>
                    <p className="stat-value">Rs. {totalRevenue.toLocaleString()}</p>
                    <span className="stat-change positive">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                      </svg>
                      12% from last month
                    </span>
                  </div>
                </div>

                {/* Total Sales Card */}
                <div className="stat-card sales-card">
                  <div className="stat-icon-wrapper blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-label">Total Sales</h3>
                    <p className="stat-value">{sales.length}</p>
                    <span className="stat-change positive">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                      </svg>
                      8% from last month
                    </span>
                  </div>
                </div>

                {/* Total Products Card */}
                <div className="stat-card products-card">
                  <div className="stat-icon-wrapper green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-label">Products</h3>
                    <p className="stat-value">{products.length}</p>
                    <span className="stat-badge warning">{lowStockCount} Low Stock</span>
                  </div>
                </div>

                {/* Categories Card */}
                <div className="stat-card categories-card">
                  <div className="stat-icon-wrapper orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-label">Categories</h3>
                    <p className="stat-value">{categories.length}</p>
                    <span className="stat-info">Active categories</span>
                  </div>
                </div>

                {/* Users Card */}
                <div className="stat-card users-card">
                  <div className="stat-icon-wrapper teal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-label">Team Members</h3>
                    <p className="stat-value">{users.length}</p>
                    <span className="stat-info">Active users</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h2 className="section-title">Quick Actions</h2>
                <div className="actions-grid">
                  <button className="action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    <span>Add Cashier</span>
                  </button>
                  
                  <button className="action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Add Product</span>
                  </button>
                  
                  <button className="action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span>Add Category</span>
                  </button>
                  
                  <button className="action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span>View Reports</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;