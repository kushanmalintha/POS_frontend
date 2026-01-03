import React, { useEffect, useState } from 'react';
import { getMySales } from '../../api/saleApi';
import './MySales.css';

const MySales = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    getMySales().then(res => setSales(res.data)).catch(err => console.log(err));
  }, []);

  return (
    <div className="my-sales-page">
      <h1>My Sales</h1>
      {sales.length === 0 ? <p>No sales yet</p> :
      <table>
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Date</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{new Date(s.timestamp).toLocaleString()}</td>
              <td>${s.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  );
};

export default MySales;
