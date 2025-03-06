import axios from 'axios';
import { API_BASE_URL, USE_MOCK_DATA } from '../../config';

// Mock transaction data and service functions
const mockTransactions = [
  {
    id: '1',
    transaction_date: '2023-05-15',
    customer_name: 'John Doe',
    customer_location: {
      country: 'US',
      state_province: 'CA'
    },
    items: [
      {
        product_id: '101',
        product_name: 'Premium Software License',
        product_type: 'Digital Software',
        quantity: 1,
        unit_price: 199.99
      }
    ],
    subtotal: 199.99,
    tax_amount: 16.50,
    total_amount: 216.49,
    tax_rate: 8.25
  },
  {
    id: '2',
    transaction_date: '2023-05-20',
    customer_name: 'Jane Smith',
    customer_location: {
      country: 'US',
      state_province: 'NY'
    },
    items: [
      {
        product_id: '202',
        product_name: 'E-book: Web Development',
        product_type: 'E-book',
        quantity: 1,
        unit_price: 29.99
      },
      {
        product_id: '203',
        product_name: 'E-book: UX Design',
        product_type: 'E-book',
        quantity: 1,
        unit_price: 24.99
      }
    ],
    subtotal: 54.98,
    tax_amount: 0,
    total_amount: 54.98,
    tax_rate: 0
  },
  {
    id: '3',
    transaction_date: '2023-06-01',
    customer_name: 'Bob Johnson',
    customer_location: {
      country: 'US',
      state_province: 'TX'
    },
    items: [
      {
        product_id: '301',
        product_name: 'Digital Music Album',
        product_type: 'Digital Media',
        quantity: 1,
        unit_price: 12.99
      }
    ],
    subtotal: 12.99,
    tax_amount: 0.81,
    total_amount: 13.80,
    tax_rate: 6.25
  }
];

// Get all transactions
export const getTransactions = async () => {
  if (USE_MOCK_DATA) {
    return [...mockTransactions];
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Get a transaction by ID
export const getTransactionById = async (id) => {
  if (USE_MOCK_DATA) {
    const transaction = mockTransactions.find(t => t.id === id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return { ...transaction };
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    throw error;
  }
};

// Create a new transaction
export const createTransaction = async (transactionData) => {
  if (USE_MOCK_DATA) {
    const newId = (Math.max(...mockTransactions.map(t => parseInt(t.id))) + 1).toString();
    const newTransaction = { ...transactionData, id: newId };
    mockTransactions.push(newTransaction);
    return newTransaction;
  }
  
  try {
    const response = await axios.post(`${API_BASE_URL}/transactions`, transactionData);
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Update a transaction
export const updateTransaction = async (id, transactionData) => {
  if (USE_MOCK_DATA) {
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    mockTransactions[index] = { ...transactionData, id };
    return { ...mockTransactions[index] };
  }
  
  try {
    const response = await axios.put(`${API_BASE_URL}/transactions/${id}`, transactionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating transaction ${id}:`, error);
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  if (USE_MOCK_DATA) {
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    mockTransactions.splice(index, 1);
    return { success: true };
  }
  
  try {
    const response = await axios.delete(`${API_BASE_URL}/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting transaction ${id}:`, error);
    throw error;
  }
}; 