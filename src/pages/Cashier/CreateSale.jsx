import React, { useState, useEffect } from 'react';
import { getProducts } from '../../api/productApi';
import { createSale } from '../../api/saleApi';
import ReceiptView from '../../components/ReceiptView';
import './CreateSale.css';

const CreateSale = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts().then(res => setProducts(res.data)).catch(err => console.log(err));
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.productId === product.id 
        ? { ...item, quantity: item.quantity + 1 } 
        : item
      ));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, qty) => {
    setCart(cart.map(item => item.productId === productId ? { ...item, quantity: qty } : item));
  };

  const removeItem = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }
    try {
      const salePayload = { items: cart.map(i => ({ productId: i.productId, quantity: i.quantity })) };
      const res = await createSale(salePayload);
      setReceipt(res.data); // Backend returns sale with invoice info
      setCart([]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating sale');
    }
  };

  return (
    <div className="create-sale-page">
      <h1>Create Sale</h1>

      {error && <div className="error">{error}</div>}

      <div className="products-list">
        <h2>Products</h2>
        {products.map(p => (
          <div key={p.id} className="product-card">
            <p>{p.name} - ${p.price}</p>
            <p>Stock: {p.stock}</p>
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className="cart">
        <h2>Cart</h2>
        {cart.length === 0 ? <p>No items</p> :
        <table>
          <thead>
            <tr><th>Name</th><th>Qty</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td>
                  <input type="number" min="1" value={item.quantity} 
                    onChange={e => updateQuantity(item.productId, parseInt(e.target.value))} />
                </td>
                <td><button onClick={() => removeItem(item.productId)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>}
        <button onClick={handleSubmit} className="submit-sale">Submit Sale</button>
      </div>

      {receipt && <ReceiptView receipt={receipt} />}
    </div>
  );
};

export default CreateSale;
