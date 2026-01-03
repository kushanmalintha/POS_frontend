import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = (username) => {
    return username
      ?.split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const getRoleBadgeClass = (role) => {
    return role === 'ADMIN' ? 'role-badge admin' : 'role-badge cashier';
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="brand-container">
          <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <div className="brand-text">
            <h2 className="brand-title">Fresh Mart</h2>
            <span className="brand-subtitle">POS System</span>
          </div>
        </div>
      </div>

      <div className="navbar-center">
        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search products, sales, or invoices..."
          />
        </div>
      </div>

      <div className="navbar-right">
        {user && (
          <>
            {/* Notifications */}
            <button className="icon-button" title="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notification-badge">3</span>
            </button>

            {/* Settings */}
            <button className="icon-button" title="Settings">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
              </svg>
            </button>

            {/* User Profile Dropdown */}
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="user-avatar">
                  {getUserInitials(user.username)}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.username}</span>
                  <span className={getRoleBadgeClass(user.role)}>
                    {user.role}
                  </span>
                </div>
                <svg 
                  className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {getUserInitials(user.username)}
                    </div>
                    <div>
                      <p className="dropdown-name">{user.username}</p>
                      <p className="dropdown-email">{user.role.toLowerCase()}@freshmart.com</p>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-item" onClick={() => navigate('/profile')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    My Profile
                  </button>
                  
                  <button className="dropdown-item" onClick={() => navigate('/settings')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                    </svg>
                    Settings
                  </button>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
