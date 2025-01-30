import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Test case 1: Adding an expense
test('should add an expense to the list and update total', async () => {
  render(<App />);

  const nameInput = screen.getByPlaceholderText('Expense Name');
  const amountInput = screen.getByPlaceholderText('Amount');
  const categoryInput = screen.getByRole('combobox');
  const dateInput = screen.getByPlaceholderText('Date');
  const addButton = screen.getByRole('button', { name: /add expense/i });

  fireEvent.change(nameInput, { target: { value: 'Lunch' } });
  fireEvent.change(amountInput, { target: { value: '20' } });
  fireEvent.change(categoryInput, { target: { value: 'Food' } });
  fireEvent.change(dateInput, { target: { value: '2025-01-19' } });
  fireEvent.click(addButton);

  await waitFor(() => {
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses: 20')).toBeInTheDocument();
  });
});

// Test case 2: Sorting expenses by amount (ascending)
test('should sort expenses by amount in ascending order', async () => {
  render(<App />);

  // Adding expenses with all required fields
  const addExpense = async (name, amount) => {
    fireEvent.change(screen.getByPlaceholderText('Expense Name'), { target: { value: name } });
    fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: amount } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Food' } });
    fireEvent.change(screen.getByPlaceholderText('Date'), { target: { value: '2025-01-19' } });
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
  };

  await addExpense('Lunch', '20');
  await addExpense('Coffee', '10');

  // Click sort button or header (depending on your implementation)
  const sortButton = screen.getByRole('button', { name: /sort by amount/i });
  fireEvent.click(sortButton);

  // Wait for the sorting to complete
  await waitFor(() => {
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Coffee');
    expect(rows[2]).toHaveTextContent('Lunch');
  });
});

// Test case 3: Deleting an expense
test('should delete an expense from the list', async () => {
  render(<App />);

  // Add an expense with all required fields
  fireEvent.change(screen.getByPlaceholderText('Expense Name'), { target: { value: 'Lunch' } });
  fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: '20' } });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Food' } });
  fireEvent.change(screen.getByPlaceholderText('Date'), { target: { value: '2025-01-19' } });
  fireEvent.click(screen.getByRole('button', { name: /add expense/i }));

  // Wait for the expense to be added
  await waitFor(() => {
    expect(screen.getByText('Lunch')).toBeInTheDocument();
  });

  const deleteButton = screen.getByRole('button', { name: /delete/i });
  fireEvent.click(deleteButton);

  await waitFor(() => {
    expect(screen.queryByText('Lunch')).not.toBeInTheDocument();
  });
});

// Test case 4: Filtering expenses by category
test('should filter expenses by category', async () => {
  render(<App />);

  // Add test expenses
  const addExpense = async (name, amount, category) => {
    fireEvent.change(screen.getByPlaceholderText('Expense Name'), { target: { value: name } });
    fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: amount } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: category } });
    fireEvent.change(screen.getByPlaceholderText('Date'), { target: { value: '2025-01-19' } });
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
  };

  await addExpense('Lunch', '20', 'Food');
  await addExpense('Bus Ticket', '5', 'Transport');
  await addExpense('Coffee', '10', 'Food');

  // Add a filter button click or similar action that your component uses
  const filterButton = screen.getByRole('button', { name: /filter/i });
  fireEvent.click(filterButton);

  // Check filtered results
  await waitFor(() => {
    const foodExpenses = screen.getAllByText('Food').length;
    expect(foodExpenses).toBe(2);
    expect(screen.queryByText('Transport')).not.toBeInTheDocument();
  });
});

// Test case 5: Form validation
test('should show error messages for invalid inputs', async () => {
  render(<App />);

  // Try to submit empty form
  const addButton = screen.getByRole('button', { name: /add expense/i });
  fireEvent.click(addButton);

  // Check for error messages
  await waitFor(() => {
    const nameInput = screen.getByPlaceholderText('Expense Name');
    const amountInput = screen.getByPlaceholderText('Amount');
    const categorySelect = screen.getByRole('combobox');
    const dateInput = screen.getByPlaceholderText('Date');

    // Check for aria-invalid attribute or similar validation indicators
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(amountInput).toHaveAttribute('aria-invalid', 'true');
    expect(categorySelect).toHaveAttribute('aria-invalid', 'true');
    expect(dateInput).toHaveAttribute('aria-invalid', 'true');
  });

  // Test invalid amount
  const amountInput = screen.getByPlaceholderText('Amount');
  fireEvent.change(amountInput, { target: { value: '-10' } });

  await waitFor(() => {
    expect(amountInput).toHaveAttribute('aria-invalid', 'true');
  });
});

// Test case 6: Date range filtering
test('should filter expenses by date range', async () => {
  render(<App />);

  // Add test expenses
  const addExpense = async (name, date) => {
    fireEvent.change(screen.getByPlaceholderText('Expense Name'), { target: { value: name } });
    fireEvent.change(screen.getByPlaceholderText('Amount'), { target: { value: '20' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Food' } });
    fireEvent.change(screen.getByPlaceholderText('Date'), { target: { value: date } });
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
  };

  await addExpense('Past Expense', '2024-01-19');
  await addExpense('Current Expense', '2025-01-19');
  await addExpense('Future Expense', '2026-01-19');

  // Click sort by date button
  const sortDateButton = screen.getByRole('button', { name: /sort by date/i });
  fireEvent.click(sortDateButton);

  // Check results are in date order
  await waitFor(() => {
    const expenses = screen.getAllByRole('row').slice(1); // Skip header row
    expect(expenses[0]).toHaveTextContent('Past Expense');
    expect(expenses[1]).toHaveTextContent('Current Expense');
    expect(expenses[2]).toHaveTextContent('Future Expense');
  });
});

// Test case 7: Total expenses calculation
test('should correctly calculate total expenses', async () => {
  render(<App />);

  // Add test expenses
  const addExpense = async (name, amount) => {
    const nameInput = screen.getByPlaceholderText('Expense Name');
    const amountInput = screen.getByPlaceholderText('Amount');
    const categoryInput = screen.getByLabelText(/category/i);
    const dateInput = screen.getByPlaceholderText('Date');

    fireEvent.change(nameInput, { target: { value: name } });
    fireEvent.change(amountInput, { target: { value: amount } });
    fireEvent.change(categoryInput, { target: { value: 'Food' } });
    fireEvent.change(dateInput, { target: { value: '2025-01-19' } });

    const addButton = screen.getByRole('button', { name: /add expense/i });
    fireEvent.click(addButton);
  };

  await addExpense('Expense 1', '20.50');
  await addExpense('Expense 2', '30.25');

  // Check total by finding the text content directly
  await waitFor(() => {
    const totalElement = screen.getByText(/total expenses: 50.75/i);
    expect(totalElement).toBeInTheDocument();
  });

  // Delete first expense
  const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
  fireEvent.click(deleteButton);

  // Check updated total
  await waitFor(() => {
    const totalElement = screen.getByText(/total expenses: 30.25/i);
    expect(totalElement).toBeInTheDocument();
  });
});
