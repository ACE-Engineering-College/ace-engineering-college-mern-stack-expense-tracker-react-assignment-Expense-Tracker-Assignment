import React, { useState } from 'react';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const addExpense = () => {
    if (expenseName && amount && category && date) {
      const newExpense = { expenseName, amount, category, date, id: Date.now() };
      setExpenses([...expenses, newExpense]);
      setTotalAmount(totalAmount + parseFloat(amount));
      setExpenseName('');
      setAmount('');
      setCategory('');
      setDate('');
    }
  };

  const deleteExpense = (index) => {
    const newExpenses = [...expenses];
    const deletedExpenseAmount = parseFloat(newExpenses[index].amount);
    newExpenses.splice(index, 1);
    setExpenses(newExpenses);
    setTotalAmount(totalAmount - deletedExpenseAmount);
  };

  const sortByAmount = () => {
    const sortedExpenses = [...expenses].sort((a, b) => a.amount - b.amount);
    setExpenses(sortedExpenses);
  };

  const sortByDate = () => {
    const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
    setExpenses(sortedExpenses);
  };

  return (
    <div className="App">
      <header>
        <h1>Expense Tracker</h1>
      </header>

      <div className="form">
        <input
          type="text"
          placeholder="Expense Name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
        </select>
        <input
          placeholder="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={addExpense}>Add Expense</button>
      </div>

      <div className="expense-list">
        <table>
          <thead>
            <tr>
              <th>Expense Name</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={expense.id}>
                <td>{expense.expenseName}</td>
                <td>{expense.amount}</td>
                <td>{expense.category}</td>
                <td>{expense.date}</td>
                <td>
                  <button onClick={() => deleteExpense(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary">
        <h3>Total Expenses: {totalAmount}</h3>
        <h3>Remaining Balance: {1000 - totalAmount}</h3>
      </div>

      <div className="sort-buttons">
        <button onClick={sortByAmount}>Sort by Amount</button>
        <button onClick={sortByDate}>Sort by Date</button>
      </div>
    </div>
  );
}

export default App;
