import React from 'react';
import './ReceiptView.css';

const ReceiptView = ({ receipt }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="receipt-view">
      <div className="receipt-content">
        <h2>{receipt.shop.name}</h2>
        <p>{receipt.shop.address}</p>
        <p>{receipt.shop.phone}</p>

        <hr />

        <p><strong>Invoice:</strong> {receipt.invoiceNumber}</p>
        <p><strong>Date:</strong> {new Date(receipt.dateTime).toLocaleString()}</p>
        <p><strong>Cashier:</strong> {receipt.cashier}</p>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.unitPrice}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />
        <h3>Total: {receipt.totalAmount}</h3>
        <p>{receipt.footer}</p>
      </div>

      <button className="print-btn" onClick={handlePrint}>
        Print Receipt
      </button>
    </div>
  );
};

export default ReceiptView;
