import React, { useState, useEffect } from 'react';
import { getTransactions, deleteTransaction } from '../../services/TransactionService/transactionService';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
      setError('');
    } catch (err) {
      setError('Failed to load transactions: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const applyFilter = () => {
    // In a real app, this would call the API with filter parameters
    // For now, we'll just simulate filtering on the client side
    loadTransactions();
  };

  const resetFilter = () => {
    setFilter({
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    });
    loadTransactions();
  };

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        // Refresh the transaction list
        loadTransactions();
      } catch (err) {
        setError('Failed to delete transaction: ' + err.message);
        console.error(err);
      }
    }
  };

  const closeTransactionModal = () => {
    setShowTransactionModal(false);
    setSelectedTransaction(null);
  };

  // Filter and search transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search functionality - check if search term is in customer name
    if (searchTerm && 
        !transaction.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply filters
    if (filter.startDate && new Date(transaction.transaction_date) < new Date(filter.startDate)) {
      return false;
    }
    if (filter.endDate && new Date(transaction.transaction_date) > new Date(filter.endDate)) {
      return false;
    }
    if (filter.minAmount && parseFloat(transaction.total_amount) < parseFloat(filter.minAmount)) {
      return false;
    }
    if (filter.maxAmount && parseFloat(transaction.total_amount) > parseFloat(filter.maxAmount)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="transaction-history-container">
    <div className="transaction-history">
      <h1>Transaction History</h1>
      
        <div className="transaction-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by customer name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="filter-toggle">
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={toggleFilter}
            >
              {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
        
        {isFilterVisible && (
          <div className="filter-section">
          <div className="filter-row">
              <div className="filter-group">
                <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filter.startDate}
                onChange={handleFilterChange}
                  className="form-control form-control-sm"
              />
            </div>
            
              <div className="filter-group">
                <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={filter.endDate}
                onChange={handleFilterChange}
                  className="form-control form-control-sm"
              />
            </div>
            
              <div className="filter-group">
                <label>Min Amount</label>
              <input
                type="number"
                name="minAmount"
                value={filter.minAmount}
                onChange={handleFilterChange}
                  placeholder="0.00"
                  className="form-control form-control-sm"
              />
            </div>
            
              <div className="filter-group">
                <label>Max Amount</label>
              <input
                type="number"
                name="maxAmount"
                value={filter.maxAmount}
                onChange={handleFilterChange}
                  placeholder="0.00"
                  className="form-control form-control-sm"
              />
              </div>
            </div>
            
            <div className="filter-actions">
              <button 
                className="btn btn-primary btn-sm"
                onClick={applyFilter}
              >
                Apply Filters
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={resetFilter}
              >
                Reset
              </button>
            </div>
          </div>
        )}
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : (
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th className="date-column">Date</th>
                  <th>Customer</th>
                  <th className="amount-column">Amount</th>
                  <th className="amount-column">Tax</th>
                  <th className="amount-column">Total</th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-results">No transactions found</td>
                  </tr>
                ) : (
                  filteredTransactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td className="date-column">{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                      <td>{transaction.customer_name}</td>
                      <td className="amount-column">${parseFloat(transaction.subtotal).toFixed(2)}</td>
                      <td className="amount-column">${parseFloat(transaction.tax_amount).toFixed(2)}</td>
                      <td className="amount-column">${parseFloat(transaction.total_amount).toFixed(2)}</td>
                      <td className="actions-column">
                        <div className="button-group">
                          <button 
                            className="btn btn-edit btn-sm" 
                            onClick={() => handleViewTransaction(transaction)}
                          >
                            View
                          </button>
                          <button 
                            className="btn btn-danger btn-sm" 
                            onClick={() => handleDeleteTransaction(transaction.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Transaction Detail Modal */}
        {showTransactionModal && selectedTransaction && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Transaction Details</h2>
                <button className="close-button" onClick={closeTransactionModal}>×</button>
              </div>
              <div className="modal-body">
                <div className="transaction-detail-row">
                  <div className="transaction-detail-label">Transaction ID:</div>
                  <div className="transaction-detail-value">{selectedTransaction.id}</div>
                </div>
                <div className="transaction-detail-row">
                  <div className="transaction-detail-label">Date:</div>
                  <div className="transaction-detail-value">
                    {new Date(selectedTransaction.transaction_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="transaction-detail-row">
                  <div className="transaction-detail-label">Customer:</div>
                  <div className="transaction-detail-value">{selectedTransaction.customer_name}</div>
                </div>
                <div className="transaction-detail-row">
                  <div className="transaction-detail-label">Email:</div>
                  <div className="transaction-detail-value">{selectedTransaction.customer_email || 'N/A'}</div>
        </div>
      
                <h3>Products</h3>
                <table className="products-table">
          <thead>
            <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
              <th>Tax</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
                    {selectedTransaction.products ? (
                      selectedTransaction.products.map((product, index) => (
                        <tr key={index}>
                          <td>{product.name}</td>
                          <td>{product.quantity}</td>
                          <td>${parseFloat(product.price).toFixed(2)}</td>
                          <td>${parseFloat(product.tax).toFixed(2)}</td>
                          <td>${parseFloat(product.total).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">
                          <div className="product-item">
                            <div className="product-name">
                              {selectedTransaction.product_type || 'Digital Product'}
                            </div>
                            <div className="product-price">
                              ${parseFloat(selectedTransaction.subtotal).toFixed(2)}
                            </div>
                          </div>
                </td>
              </tr>
                    )}
          </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2"></td>
                      <td colSpan="2">Subtotal:</td>
                      <td>${parseFloat(selectedTransaction.subtotal).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="2"></td>
                      <td colSpan="2">Tax:</td>
                      <td>${parseFloat(selectedTransaction.tax_amount).toFixed(2)}</td>
                    </tr>
                    <tr className="total-row">
                      <td colSpan="2"></td>
                      <td colSpan="2">Total:</td>
                      <td>${parseFloat(selectedTransaction.total_amount).toFixed(2)}</td>
                    </tr>
                  </tfoot>
        </table>
                
                <h3>Tax Details</h3>
                <div className="transaction-detail-row">
                  <div className="transaction-detail-label">Jurisdiction:</div>
                  <div className="transaction-detail-value">
                    {selectedTransaction.jurisdiction || 'N/A'}
                  </div>
                </div>
                <div className="transaction-detail-row">
                  <div className="transaction-detail-label">Tax Rate:</div>
                  <div className="transaction-detail-value">
                    {selectedTransaction.tax_rate ? `${(parseFloat(selectedTransaction.tax_rate) * 100).toFixed(2)}%` : 'N/A'}
                  </div>
                </div>
                <div className="transaction-detail-row">
                  <div className="transaction-detail-label">Tax Rules Applied:</div>
                  <div className="transaction-detail-value">
                    {selectedTransaction.tax_rules_applied || 'Standard rate'}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeTransactionModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory; 