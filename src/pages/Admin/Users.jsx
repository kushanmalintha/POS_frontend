import React, { useState, useEffect } from 'react';
import { getAllUsers, createUser } from '../../api/userApi';
import './Users.css';

const Users = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cashiers, setCashiers] = useState([]);
  const [error, setError] = useState('');

  const fetchUsers = () => {
    getAllUsers()
      .then(res => setCashiers(res.data.filter(u => u.role === 'CASHIER')))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({ username, password, role: 'CASHIER' });
      setUsername('');
      setPassword('');
      setError('');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating cashier');
    }
  };

  return (
    <div className="users-page">
      <h1>Manage Cashiers</h1>
      <form onSubmit={handleSubmit} className="user-form">
        {error && <div className="error">{error}</div>}
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Add Cashier</button>
      </form>

      <h2>Existing Cashiers</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {cashiers.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
