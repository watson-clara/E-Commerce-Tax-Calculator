import React, { useState, useEffect } from 'react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    jurisdiction: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from your API
    const mockTransactions = [
      {
        id: 1,
        transaction_date: '2023-04-15T10:30:00Z',
        customer_id: 'CUST-001',
        customer_location: { country: 'US', state_province: 'CA', city: 'San Francisco' },
        items: [
          { product_id: 'PROD-001', product_name: 'Software License', product_type: 'Digital Software', quantity: 1, unit_price: 99.99, subtotal: 99.99 }
        ],
        subtotal: 99.99,
        tax_amount: 8.50,
        total: 108.49,
        tax_details: [
          { jurisdiction: 'California', rate: 8.5, tax_amount: 8.50 }
        ]
      },
      {
        id: 2,
        transaction_date: '2023-04-14T14:45:00Z',
        customer_id: 'CUST-002',
        customer_location: { country: 'US', state_province: 'NY', city: 'New York' },
        items: [
          { product_id: 'PROD-002', product_name: 'E-book Bundle', product_type: 'E-book', quantity: 3, unit_price: 29.99, subtotal: 89.97 }
        ],
        subtotal: 89.97,
        tax_amount: 7.98,
        total: 97.95,
        tax_details: [
          { jurisdiction: 'New York', rate: 8.875, tax_amount: 7.98 }
        ]
      },
      {
        id: 3,
        transaction_date: '2023-04-13T09:15:00Z',
        customer_id: 'CUST-003',
        customer_location: { country: 'UK', state_province: '', city: 'London' },
        items: [
          { product_id: 'PROD-003', product_name: 'Online Course', product_type: 'Online Course', quantity: 1, unit_price: 199.99, subtotal: 199.99 }
        ],
        subtotal: 199.99,
        tax_amount: 40.00,
        total: 239.99,
        tax_details: [
          { jurisdiction: 'United Kingdom', rate: 20.0, tax_amount: 40.00 }
        ]
      }
    ];
    
    setTransactions(mockTransactions);
    setLoading(false);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const applyFilters = () => {
    // In a real app, this would send a request to your API with the filters
    console.log('Applying filters:', filter);
    // For demo purposes, we'll just log the filters
  };

  const resetFilters = () => {
    setFilter({
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      jurisdiction: ''
    });
  };

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error loading transactions: {error}</div>;

  return (
    <div className="transaction-history">
      <h1>Transaction History</h1>
      
      <section className="filters">
        <h2>Filter Transactions</h2>
        <div className="filter-form">
          <div className="filter-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filter.startDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filter.endDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="minAmount">Min Amount:</label>
              <input
                type="number"
                id="minAmount"
                name="minAmount"
                value={filter.minAmount}
                onChange={handleFilterChange}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="maxAmount">Max Amount:</label>
              <input
                type="number"
                id="maxAmount"
                name="maxAmount"
                value={filter.maxAmount}
                onChange={handleFilterChange}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="jurisdiction">Jurisdiction:</label>
              <select
                id="jurisdiction"
                name="jurisdiction"
                value={filter.jurisdiction}
                onChange={handleFilterChange}
              >
                <option value="">All Jurisdictions</option>
                <option value="US-CA">California</option>
                <option value="US-NY">New York</option>
                <option value="US-TX">Texas</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
          </div>
          
          <div className="filter-buttons">
            <button onClick={applyFilters} className="btn btn-primary">Apply Filters</button>
            <button onClick={resetFilters} className="btn btn-secondary">Reset</button>
          </div>
        </div>
      </section>
      
      <section className="transactions-list">
        <h2>Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Location</th>
              <th>Items</th>
              <th>Subtotal</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td>{transaction.customer_id}</td>
                <td>
                  {transaction.customer_location.country}
                  {transaction.customer_location.state_province && `, ${transaction.customer_location.state_province}`}
                </td>
                <td>{transaction.items.length} item(s)</td>
                <td>${transaction.subtotal.toFixed(2)}</td>
                <td>${transaction.tax_amount.toFixed(2)}</td>
                <td>${transaction.total.toFixed(2)}</td>
                <td>
                  <button className="btn btn-small">View</button>
                  <button className="btn btn-small btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default TransactionHistory; 