import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>POS System</h2>
      </div>
      <div className="navbar-right">
        {user && (
          <>
            <span>{user.username} ({user.role})</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
