import React from 'react';
import './ReceiptView.css';

const ReceiptView = ({ receipt }) => {
  if (!receipt) return null;

  return (
    <div className="receipt-view">
      <h2>{receipt.shop.name}</h2>
      <p>{receipt.shop.address} | {receipt.shop.phone}</p>
      <hr/>
      <p>Invoice: {receipt.invoiceNumber}</p>
      <p>Date: {new Date(receipt.dateTime).toLocaleString()}</p>
      <p>Cashier: {receipt.cashier}</p>
      <table>
        <thead>
          <tr><th>Name</th><th>Qty</th><th>Unit</th><th>Total</th></tr>
        </thead>
        <tbody>
          {receipt.items.map((i, idx) => (
            <tr key={idx}>
              <td>{i.name}</td>
              <td>{i.qty}</td>
              <td>${i.unitPrice}</td>
              <td>${i.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total: ${receipt.totalAmount}</h3>
      <p>{receipt.footer}</p>
    </div>
  );
};

export default ReceiptView;
