const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Sample expense data with casual expenses
let expenses = [
  { id: 1, description: "Coffee", amount: 4.50, category: "Food", date: "2025-12-10" },
  { id: 2, description: "Lunch", amount: 12.75, category: "Food", date: "2025-12-10" },
  { id: 3, description: "Gas", amount: 45.60, category: "Transport", date: "2025-12-09" },
  { id: 4, description: "Movie ticket", amount: 15.99, category: "Entertainment", date: "2025-12-08" },
  { id: 5, description: "Gym membership", amount: 29.99, category: "Health", date: "2025-12-07" },
  { id: 6, description: "Dinner", amount: 38.25, category: "Food", date: "2025-12-06" },
  { id: 7, description: "Books", amount: 23.47, category: "Education", date: "2025-12-05" },
  { id: 8, description: "Phone bill", amount: 65.00, category: "Utilities", date: "2025-12-01" },
  { id: 9, description: "Snacks", amount: 7.32, category: "Food", date: "2025-12-11" },
  { id: 10, description: "Uber ride", amount: 18.50, category: "Transport", date: "2025-12-11" }
];

let nextId = 11;

// GET all expenses
app.get('/api/expenses', (req, res) => {
  const category = req.query.category;
  if (category) {
    return res.json(expenses.filter(e => e.category === category));
  }
  res.json(expenses);
});

// GET single expense
app.get('/api/expenses/:id', (req, res) => {
  const expense = expenses.find(e => e.id === parseInt(req.params.id));
  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  res.json(expense);
});

// POST new expense
app.post('/api/expenses', (req, res) => {
  const { description, amount, category, date } = req.body;
  
  if (!description || amount === undefined || !category || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newExpense = {
    id: nextId++,
    description,
    amount: parseFloat(amount),
    category,
    date
  };

  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// PUT update expense
app.put('/api/expenses/:id', (req, res) => {
  const expense = expenses.find(e => e.id === parseInt(req.params.id));
  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  const { description, amount, category, date } = req.body;
  
  if (description) expense.description = description;
  if (amount !== undefined) expense.amount = parseFloat(amount);
  if (category) expense.category = category;
  if (date) expense.date = date;

  res.json(expense);
});

// DELETE expense
app.delete('/api/expenses/:id', (req, res) => {
  const index = expenses.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  const deleted = expenses.splice(index, 1);
  res.json(deleted[0]);
});

// GET summary
app.get('/api/summary', (req, res) => {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = {};

  expenses.forEach(e => {
    if (!byCategory[e.category]) {
      byCategory[e.category] = 0;
    }
    byCategory[e.category] += e.amount;
  });

  res.json({
    total: parseFloat(total.toFixed(2)),
    count: expenses.length,
    byCategory
  });
});

app.listen(PORT, () => {
  console.log(`Expense Tracker API running on http://localhost:${PORT}`);
});
