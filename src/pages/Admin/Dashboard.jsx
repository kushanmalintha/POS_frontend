import React, { useEffect, useState } from 'react';
import { getCategories } from '../../api/categoryApi';
import { getProducts } from '../../api/productApi';
import { getAllUsers } from '../../api/userApi';
import { getAllSales } from '../../api/saleApi';
import './Dashboard.css';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(err => console.log(err));
    getProducts().then(res => setProducts(res.data)).catch(err => console.log(err));
    getAllUsers().then(res => setUsers(res.data)).catch(err => console.log(err));
    getAllSales().then(res => setSales(res.data)).catch(err => console.log(err));
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="cards">
        <div className="card">
          <h2>Users</h2>
          <p>{users.length}</p>
        </div>
        <div className="card">
          <h2>Categories</h2>
          <p>{categories.length}</p>
        </div>
        <div className="card">
          <h2>Products</h2>
          <p>{products.length}</p>
        </div>
        <div className="card">
          <h2>Sales</h2>
          <p>{sales.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
