import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getMySales, getReceipt } from '../../api/saleApi';
import ReceiptView from '../../components/ReceiptView';
import './MySales.css';

const MySales = () => {
  const [sales, setSales] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    getMySales()
      .then(res => setSales(res.data))
      .catch(err => console.log(err));
  }, []);

  const viewReceipt = async (saleId) => {
    const res = await getReceipt(saleId);
    setSelectedReceipt(res.data);
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="dashboard-main">
          <h1>My Sales</h1>

          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.id}>
                  <td>{sale.invoiceNumber}</td>
                  <td>{new Date(sale.timestamp).toLocaleString()}</td>
                  <td>{sale.totalAmount}</td>
                  <td>
                    <button onClick={() => viewReceipt(sale.id)}>
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedReceipt && <ReceiptView receipt={selectedReceipt} />}
        </div>
      </div>
    </div>
  );
};

export default MySales;
