import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getMySales } from '../../api/saleApi';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const CashierDashboard = () => {
  const { user } = useContext(AuthContext);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todaySales: 0,
    todayRevenue: 0,
    totalSales: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getMySales();
        setSales(res.data);
        
        // Calculate stats
        const today = new Date().toDateString();
        const todaySalesData = res.data.filter(sale => 
          new Date(sale.timestamp).toDateString() === today
        );
        
        setStats({
          todaySales: todaySalesData.length,
          todayRevenue: todaySalesData.reduce((sum, sale) => sum + sale.totalAmount, 0),
          totalSales: res.data.length,
          totalRevenue: res.data.reduce((sum, sale) => sum + sale.totalAmount, 0)
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const recentSales = sales.slice(0, 5);

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="dashboard-main">
          {/* Welcome Header */}
          <div className="welcome-header">
            <div className="welcome-content">
              <h1 className="welcome-title">
                {getGreeting()}, {user?.username}! 👋
              </h1>
              <p className="welcome-subtitle">
                Ready to serve customers today? Let's make it a great day!
              </p>
            </div>
            <div className="quick-action-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <button className="quick-sale-btn" onClick={() => window.location.href = '/cashier/create-sale'}>
                Start New Sale
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner-large"></div>
              <p>Loading your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="cashier-stats-grid">
                <div className="cashier-stat-card blue">
                  <div className="stat-header">
                    <div className="stat-icon-wrapper blue">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                    </div>
                    <span className="stat-period">Today</span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-value">{stats.todaySales}</h3>
                    <p className="stat-label">Sales Today</p>
                  </div>
                </div>

                <div className="cashier-stat-card green">
                  <div className="stat-header">
                    <div className="stat-icon-wrapper green">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <span className="stat-period">Today</span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-value">Rs. {stats.todayRevenue.toLocaleString()}</h3>
                    <p className="stat-label">Revenue Today</p>
                  </div>
                </div>

                <div className="cashier-stat-card purple">
                  <div className="stat-header">
                    <div className="stat-icon-wrapper purple">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                      </svg>
                    </div>
                    <span className="stat-period">All Time</span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-value">{stats.totalSales}</h3>
                    <p className="stat-label">Total Sales</p>
                  </div>
                </div>

                <div className="cashier-stat-card orange">
                  <div className="stat-header">
                    <div className="stat-icon-wrapper orange">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                      </svg>
                    </div>
                    <span className="stat-period">All Time</span>
                  </div>
                  <div className="stat-details">
                    <h3 className="stat-value">Rs. {stats.totalRevenue.toLocaleString()}</h3>
                    <p className="stat-label">Total Revenue</p>
                  </div>
                </div>
              </div>

              {/* Recent Sales */}
              <div className="recent-sales-section">
                <div className="section-header">
                  <h2 className="section-title">Recent Sales</h2>
                  <button 
                    className="view-all-btn"
                    onClick={() => window.location.href = '/cashier/my-sales'}
                  >
                    View All
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>

                {recentSales.length > 0 ? (
                  <div className="recent-sales-list">
                    {recentSales.map(sale => (
                      <div key={sale.id} className="recent-sale-card">
                        <div className="sale-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                        </div>
                        <div className="sale-info">
                          <h4 className="sale-invoice">{sale.invoiceNumber}</h4>
                          <p className="sale-time">
                            {new Date(sale.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="sale-amount">
                          Rs. {sale.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <h3>No sales yet</h3>
                    <p>Start creating sales to see them here</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="quick-actions-grid">
                <button 
                  className="action-card create-sale"
                  onClick={() => window.location.href = '/cashier/create-sale'}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  <span>Create New Sale</span>
                </button>

                <button 
                  className="action-card view-sales"
                  onClick={() => window.location.href = '/cashier/my-sales'}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <span>View My Sales</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;