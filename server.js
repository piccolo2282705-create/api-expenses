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

// Generate random expenses dataset
function generateRandomExpenses() {
  const descriptions = {
    Food: ["Coffee", "Lunch", "Dinner", "Breakfast", "Snacks", "Grocery shopping", "Restaurant", "Pizza", "Burger", "Sushi"],
    Transport: ["Gas", "Uber ride", "Taxi", "Bus fare", "Parking", "Car maintenance", "Train ticket", "Flight", "Bike repair"],
    Entertainment: ["Movie ticket", "Concert", "Gaming", "Netflix subscription", "Spotify subscription", "Book", "Video game", "Theme park"],
    Health: ["Gym membership", "Doctor visit", "Dentist", "Pharmacy", "Yoga class", "Vitamins", "Haircut"],
    Education: ["Course", "Textbook", "Online class", "Workshop", "Tuition", "Training"],
    Utilities: ["Phone bill", "Internet", "Electric", "Water bill", "Gas bill", "Wifi"],
    Shopping: ["Clothes", "Shoes", "Electronics", "Furniture", "Home decor", "Jewelry"]
  };

  const categories = Object.keys(descriptions);
  const expenses = [];
  let id = 1;

  for (let i = 0; i < 30; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const descriptionList = descriptions[category];
    const description = descriptionList[Math.floor(Math.random() * descriptionList.length)];
    const amount = (Math.random() * 100 + 5).toFixed(2);
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const formattedDate = date.toISOString().split('T')[0];

    expenses.push({
      id,
      description,
      amount: parseFloat(amount),
      category,
      date: formattedDate
    });
    id++;
  }

  return expenses;
}

let expenses = generateRandomExpenses();
let nextId = expenses.length + 1;

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
