import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', stock: '', categoryId: '' });
  const [editId, setEditId] = useState(null);

  const fetchProducts = () => getProducts().then(res => setProducts(res.data));
  const fetchCategories = () => getCategories().then(res => setCategories(res.data));

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
    if (editId) {
      updateProduct(editId, payload).then(() => { setEditId(null); setForm({ name: '', price: '', stock: '', categoryId: '' }); fetchProducts(); });
    } else {
      createProduct(payload).then(() => { setForm({ name: '', price: '', stock: '', categoryId: '' }); fetchProducts(); });
    }
  };

  const handleEdit = (prod) => {
    setEditId(prod.id);
    setForm({ name: prod.name, price: prod.price, stock: prod.stock, categoryId: prod.category.id });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      deleteProduct(id).then(fetchProducts);
    }
  };

  return (
    <div className="products-page">
      <h1>Products</h1>
      <form onSubmit={handleSubmit} className="product-form">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
        <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.category.name}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
