import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

describe('App Component', () => {
  test('renders the application title', () => {
    render(<App />);
    const titleElement = screen.getByText(/E-Commerce Tax Calculator/i);
    expect(titleElement).toBeInTheDocument();
  });
  
  test('allows adding a product', async () => {
    render(<App />);
    
    // Find the "Add Product" button and click it
    const addButton = screen.getByText('Add Product');
    fireEvent.click(addButton);
    
    // Should now have two product forms
    const productItems = document.querySelectorAll('.product-item');
    expect(productItems.length).toBe(2);
  });
  
  test('allows removing a product', async () => {
    render(<App />);
    
    // Add a product first
    const addButton = screen.getByText('Add Product');
    fireEvent.click(addButton);
    
    // Should now have two product forms
    let productItems = document.querySelectorAll('.product-item');
    expect(productItems.length).toBe(2);
    
    // Find the "Remove" button on the second product and click it
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[1]); // Click the second remove button
    
    // Should now have one product form again
    productItems = document.querySelectorAll('.product-item');
    expect(productItems.length).toBe(1);
  });
  
  test('calculates tax when form is filled and submitted', async () => {
    render(<App />);
    
    // Fill out the product form
    const nameInput = screen.getByPlaceholderText('Product Name');
    const typeSelect = screen.getByRole('combobox', { name: /Product Type/i });
    const priceInput = screen.getByPlaceholderText('0.00');
    
    userEvent.type(nameInput, 'Test Product');
    userEvent.selectOptions(typeSelect, 'Digital Software');
    userEvent.clear(priceInput);
    userEvent.type(priceInput, '99.99');
    
    // Click calculate button
    const calculateButton = screen.getByText('Calculate Tax');
    fireEvent.click(calculateButton);
    
    // Check that results are displayed
    await waitFor(() => {
      expect(screen.getByText('Tax Calculation Results')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument(); // Subtotal
      expect(screen.getByText('$8.50')).toBeInTheDocument(); // Tax amount for CA (8.5%)
      expect(screen.getByText('$108.49')).toBeInTheDocument(); // Total
    });
  });
  
  test('shows validation error when required fields are missing', async () => {
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    
    render(<App />);
    
    // Don't fill out the form
    
    // Click calculate button
    const calculateButton = screen.getByText('Calculate Tax');
    fireEvent.click(calculateButton);
    
    // Check that alert was called
    expect(alertMock).toHaveBeenCalledWith('Please fill in all product details');
    
    // Cleanup
    alertMock.mockRestore();
  });
  
  test('changes tax rate when location changes', async () => {
    render(<App />);
    
    // Fill out the product form
    const nameInput = screen.getByPlaceholderText('Product Name');
    const typeSelect = screen.getByRole('combobox', { name: /Product Type/i });
    const priceInput = screen.getByPlaceholderText('0.00');
    
    userEvent.type(nameInput, 'Test Product');
    userEvent.selectOptions(typeSelect, 'Digital Software');
    userEvent.clear(priceInput);
    userEvent.type(priceInput, '100');
    
    // Change location to New York
    const stateSelect = screen.getByRole('combobox', { name: /State\/Province/i });
    userEvent.selectOptions(stateSelect, 'NY');
    
    // Click calculate button
    const calculateButton = screen.getByText('Calculate Tax');
    fireEvent.click(calculateButton);
    
    // Check that results use NY tax rate
    await waitFor(() => {
      expect(screen.getByText('Tax Rate (New York):')).toBeInTheDocument();
      expect(screen.getByText('8.875%')).toBeInTheDocument();
      expect(screen.getByText('$8.88')).toBeInTheDocument(); // Tax amount for NY (8.875%)
    });
  });
}); 