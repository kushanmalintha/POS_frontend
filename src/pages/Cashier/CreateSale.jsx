import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getProducts } from '../../api/productApi';
import { createSale } from '../../api/saleApi';
import './CreateSale.css';

const CreateSale = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProducts()
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const addItem = (product) => {
    const existingIndex = saleItems.findIndex(item => item.productId === product.id);
    
    if (existingIndex !== -1) {
      updateQuantity(existingIndex, saleItems[existingIndex].quantity + 1);
    } else {
      setSaleItems(prev => [...prev, { 
        productId: product.id, 
        name: product.name, 
        price: product.price,
        stock: product.stock,
        quantity: 1 
      }]);
    }
  };

  const updateQuantity = (index, qty) => {
    const item = saleItems[index];
    if (qty > item.stock) {
      setMessage({ type: 'error', text: `Only ${item.stock} items available in stock` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }
    
    if (qty <= 0) {
      removeItem(index);
      return;
    }
    
    setSaleItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: qty } : item
    ));
  };

  const removeItem = (index) => {
    setSaleItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setSaleItems([]);
    setMessage({ type: '', text: '' });
  };

  const calculateTotal = () => {
    return saleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = async () => {
    if (saleItems.length === 0) {
      setMessage({ type: 'error', text: 'Please add items to the cart' });
      return;
    }

    setSubmitting(true);
    const request = { 
      items: saleItems.map(item => ({ 
        productId: item.productId, 
        quantity: item.quantity 
      })) 
    };

    try {
      const res = await createSale(request);
      setMessage({ 
        type: 'success', 
        text: `Sale created successfully! Invoice: ${res.data.invoiceNumber}` 
      });
      setSaleItems([]);
      
      // Refresh products to update stock
      const productsRes = await getProducts();
      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Error creating sale' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="dashboard-main create-sale-page">
          <div className="page-header">
            <h1 className="page-title">Create New Sale</h1>
            <p className="page-subtitle">Select products and add them to cart</p>
          </div>

          {message.text && (
            <div className={`alert ${message.type}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {message.type === 'success' ? (
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                ) : (
                  <circle cx="12" cy="12" r="10"></circle>
                )}
                {message.type === 'success' ? (
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                ) : (
                  <>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </>
                )}
              </svg>
              <span>{message.text}</span>
              <button onClick={() => setMessage({ type: '', text: '' })}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          <div className="sale-container">
            {/* Products Section */}
            <div className="products-section">
              <div className="section-header">
                <h2 className="section-title">Available Products</h2>
                <div className="search-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading products...</p>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <div key={product.id} className="product-card">
                        <div className="product-header">
                          <h3 className="product-name">{product.name}</h3>
                          <span className={`stock-badge ${product.stock < 10 ? 'low' : ''}`}>
                            Stock: {product.stock}
                          </span>
                        </div>
                        <div className="product-footer">
                          <div className="product-price">Rs. {product.price}</div>
                          <button 
                            className="add-btn"
                            onClick={() => addItem(product)}
                            disabled={product.stock === 0}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-products">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <p>No products found</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Section */}
            <div className="cart-section">
              <div className="cart-header">
                <h2 className="cart-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Shopping Cart
                </h2>
                {saleItems.length > 0 && (
                  <button className="clear-btn" onClick={clearCart}>
                    Clear All
                  </button>
                )}
              </div>

              <div className="cart-items">
                {saleItems.length > 0 ? (
                  saleItems.map((item, index) => (
                    <div key={index} className="cart-item">
                      <div className="cart-item-info">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <p className="cart-item-price">Rs. {item.price} each</p>
                      </div>
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button 
                            className="qty-btn"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="qty-input"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                          />
                          <button 
                            className="qty-btn"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>
                        <div className="cart-item-total">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </div>
                        <button 
                          className="remove-btn"
                          onClick={() => removeItem(index)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-cart">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <h3>Cart is empty</h3>
                    <p>Add products to get started</p>
                  </div>
                )}
              </div>

              {saleItems.length > 0 && (
                <div className="cart-footer">
                  <div className="cart-summary">
                    <div className="summary-row">
                      <span>Items</span>
                      <span>{saleItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span>Rs. {calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                  <button 
                    className="checkout-btn"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="spinner-small"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Complete Sale
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSale;