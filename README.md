# 💰 Expense Tracker App

A simple yet powerful expense tracking application with decimal number support and a casual dataset.

## Features

✅ **Decimal Support** - Track expenses with precise decimal amounts (e.g., $4.50, $12.75)  
✅ **Multiple Categories** - Food, Transport, Entertainment, Health, Education, Utilities, Shopping, Other  
✅ **Category Filtering** - Filter expenses by category  
✅ **Summary Dashboard** - View total expenses and count  
✅ **Category Breakdown** - See spending distribution across categories with visual progress bars  
✅ **Date Tracking** - All expenses timestamped  
✅ **Sample Data** - Comes pre-loaded with casual, realistic expenses  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  

## Sample Data

The app comes with 10 pre-loaded sample expenses:
- Coffee: $4.50
- Lunch: $12.75
- Gas: $45.60
- Movie ticket: $15.99
- Gym membership: $29.99
- Dinner: $38.25
- Books: $23.47
- Phone bill: $65.00
- Snacks: $7.32
- Uber ride: $18.50

**Total: $260.87**

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### Get all expenses
```bash
GET /api/expenses
```

### Get expenses by category
```bash
GET /api/expenses?category=Food
```

### Get single expense
```bash
GET /api/expenses/:id
```

### Add new expense
```bash
POST /api/expenses
Content-Type: application/json

{
  "description": "Coffee",
  "amount": 4.50,
  "category": "Food",
  "date": "2025-12-11"
}
```

### Update expense
```bash
PUT /api/expenses/:id
Content-Type: application/json

{
  "description": "Updated description",
  "amount": 5.00,
  "category": "Food",
  "date": "2025-12-11"
}
```

### Delete expense
```bash
DELETE /api/expenses/:id
```

### Get summary
```bash
GET /api/summary
```

Returns:
```json
{
  "total": 260.87,
  "count": 10,
  "byCategory": {
    "Food": 62.57,
    "Transport": 64.10,
    "Entertainment": 15.99,
    "Health": 29.99,
    "Education": 23.47,
    "Utilities": 65.00
  }
}
```

## Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: RESTful API with CORS support
- **Data Format**: JSON

## Features Breakdown

### Dashboard
- Real-time total expense amount with decimal precision
- Count of all expenses
- Category breakdown with visual progress bars

### Form
- Add expenses with description, amount (decimal), category, and date
- Form validation
- Auto-filled date (today's date)

### Expense List
- View all expenses sorted by date (newest first)
- Category badges
- Delete functionality
- Responsive grid layout

### Filtering
- Quick filter buttons for each category
- "All" button to show all expenses
- Real-time filtering

### Summary
- Category breakdown with percentages
- Progress bars for visual spending distribution
- Sorted by highest spending first

## Project Structure

```
api-expenses/
├── README.md
├── package.json
├── server.js              # Express server & API
└── public/
    ├── index.html         # Main HTML file
    ├── style.css          # Styling
    └── script.js          # Frontend JavaScript
```

## How to Use

1. **View Expenses**: Browse the pre-loaded expenses in the list
2. **Filter by Category**: Click category buttons to filter expenses
3. **Add Expense**: Fill out the form and click "Add Expense"
4. **Delete Expense**: Click the "Delete" button on any expense
5. **Check Summary**: View totals and breakdown in the dashboard and category breakdown sections

## Future Enhancements

- Edit existing expenses
- Export to CSV
- Monthly reports
- Budget tracking
- Data persistence (database)
- User authentication

## License

MIT
