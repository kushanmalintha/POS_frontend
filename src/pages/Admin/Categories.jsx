import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoryApi';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchCategories = () => {
    getCategories().then(res => setCategories(res.data)).catch(err => console.log(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateCategory(editId, { name }).then(() => { setEditId(null); setName(''); fetchCategories(); });
    } else {
      createCategory({ name }).then(() => { setName(''); fetchCategories(); });
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setName(cat.name);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      deleteCategory(id).then(fetchCategories);
    }
  };

  return (
    <div className="categories-page">
      <h1>Categories</h1>
      <form onSubmit={handleSubmit} className="category-form">
        <input type="text" placeholder="Category Name" value={name} onChange={e => setName(e.target.value)} required />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>
                <button onClick={() => handleEdit(cat)}>Edit</button>
                <button onClick={() => handleDelete(cat.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
