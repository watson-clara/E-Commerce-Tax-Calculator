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
  
  // Add more tests as needed...
}); 