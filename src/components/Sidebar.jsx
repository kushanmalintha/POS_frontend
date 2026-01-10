import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Categories', path: '/admin/categories' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Sales', path: '/admin/sales' },
  ];

  const cashierLinks = [
    { name: 'Dashboard', path: '/cashier/dashboard' },
    { name: 'Create Sale', path: '/cashier/create-sale' },
    { name: 'My Sales', path: '/cashier/my-sales' },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : cashierLinks;

  return (
    <aside className="sidebar">
      <ul>
        {links.map(link => (
          <li key={link.path}>
            <NavLink 
              to={link.path} 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
