import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getMySales, getReceipt } from '../../api/saleApi';
import ReceiptView from '../../components/ReceiptView';
import './MySales.css';

const MySales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    getMySales()
      .then(res => {
        setSales(res.data);
        setFilteredSales(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = sales;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sale =>
        sale.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.timestamp).toISOString().split('T')[0];
        return saleDate === dateFilter;
      });
    }

    setFilteredSales(filtered);
  }, [searchTerm, dateFilter, sales]);

  const viewReceipt = async (saleId) => {
    try {
      const res = await getReceipt(saleId);
      setSelectedReceipt(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const closeReceipt = () => {
    setSelectedReceipt(null);
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="dashboard-main my-sales-page">
          {/* Page Header */}
          <div className="sales-page-header">
            <div className="page-header-left">
              <h1>My Sales</h1>
              <p>View and manage all your sales transactions</p>
            </div>
            <div className="filter-controls">
              <input
                type="text"
                className="filter-input"
                placeholder="Search by invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="date"
                className="filter-input"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Sales Table */}
          <div className="sales-table-container">
            {loading ? (
              <div className="loading-sales">
                <div className="spinner-large"></div>
                <p>Loading your sales...</p>
              </div>
            ) : filteredSales.length > 0 ? (
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Invoice Number</th>
                    <th>Date & Time</th>
                    <th>Total Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map(sale => (
                    <tr key={sale.id}>
                      <td className="invoice-cell">{sale.invoiceNumber}</td>
                      <td className="date-cell">
                        {new Date(sale.timestamp).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="amount-cell">
                        Rs. {sale.totalAmount.toLocaleString()}
                      </td>
                      <td className="action-cell">
                        <button 
                          className="view-receipt-btn"
                          onClick={() => viewReceipt(sale.id)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-sales">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                <h3>No sales found</h3>
                <p>
                  {searchTerm || dateFilter
                    ? 'Try adjusting your filters'
                    : "You haven't made any sales yet"}
                </p>
                {!searchTerm && !dateFilter && (
                  <a href="/cashier/create-sale" className="create-sale-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    Create Your First Sale
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Receipt Modal */}
          {selectedReceipt && (
            <div className="receipt-modal-overlay" onClick={closeReceipt}>
              <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={closeReceipt}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <ReceiptView receipt={selectedReceipt} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MySales;