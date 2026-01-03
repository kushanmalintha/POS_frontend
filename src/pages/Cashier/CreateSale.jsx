import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getProducts } from '../../api/productApi';
import { createSale } from '../../api/saleApi';
import './CreateSale.css';

const CreateSale = () => {
  const [products, setProducts] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getProducts().then(res => setProducts(res.data)).catch(err => console.log(err));
  }, []);

  const addItem = (product) => {
    setSaleItems(prev => [...prev, { productId: product.id, name: product.name, quantity: 1 }]);
  };

  const updateQuantity = (index, qty) => {
    setSaleItems(prev => prev.map((item, i) => i === index ? { ...item, quantity: qty } : item));
  };

  const removeItem = (index) => {
    setSaleItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (saleItems.length === 0) return;
    const request = { items: saleItems.map(item => ({ productId: item.productId, quantity: item.quantity })) };
    createSale(request)
      .then(res => setMessage(`Sale created! Invoice: ${res.data.invoiceNumber}`))
      .catch(err => setMessage(err.response?.data?.message || 'Error creating sale'));
    setSaleItems([]);
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="dashboard-main">
          <h1>Create Sale</h1>
          <div className="product-list">
            <h2>Products</h2>
            {products.map(p => (
              <div key={p.id} className="product-item">
                <span>{p.name} (${p.price}) - Stock: {p.stock}</span>
                <button onClick={() => addItem(p)}>Add</button>
              </div>
            ))}
          </div>

          <div className="sale-items">
            <h2>Sale Items</h2>
            {saleItems.map((item, index) => (
              <div key={index} className="sale-item">
                <span>{item.name}</span>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                />
                <button onClick={() => removeItem(index)}>Remove</button>
              </div>
            ))}
          </div>

          <button className="submit-btn" onClick={handleSubmit}>Submit Sale</button>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default CreateSale;
