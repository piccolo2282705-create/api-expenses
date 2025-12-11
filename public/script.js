const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : `${window.location.origin}/api`;

// Set today's date as default
document.getElementById('date').valueAsDate = new Date();

// Load expenses on page load
document.addEventListener('DOMContentLoaded', () => {
    loadExpenses();
    loadSummary();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('expenseForm').addEventListener('submit', addExpense);

    // Category filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            loadExpenses(category);
        });
    });
}

// Load all expenses or filter by category
async function loadExpenses(category = '') {
    try {
        const url = category 
            ? `${API_URL}/expenses?category=${encodeURIComponent(category)}`
            : `${API_URL}/expenses`;
        
        const response = await fetch(url);
        const expenses = await response.json();
        displayExpenses(expenses);
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}

// Display expenses in the list
function displayExpenses(expenses) {
    const expensesList = document.getElementById('expensesList');
    
    if (expenses.length === 0) {
        expensesList.innerHTML = '<div class="empty-state"><p>No expenses found</p></div>';
        return;
    }

    // Sort by date (newest first)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    expensesList.innerHTML = expenses.map(expense => `
        <div class="expense-item">
            <div class="expense-info">
                <div class="expense-description">${escapeHtml(expense.description)}</div>
                <div class="expense-meta">
                    <span class="expense-category">${escapeHtml(expense.category)}</span>
                    <span>${formatDate(expense.date)}</span>
                </div>
            </div>
            <div class="expense-amount">$${parseFloat(expense.amount).toFixed(2)}</div>
            <div class="expense-actions">
                <button class="btn btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add new expense
async function addExpense(e) {
    e.preventDefault();

    const expense = {
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        date: document.getElementById('date').value
    };

    try {
        const response = await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        });

        if (response.ok) {
            // Clear form
            document.getElementById('expenseForm').reset();
            document.getElementById('date').valueAsDate = new Date();

            // Reload data
            loadExpenses();
            loadSummary();
            showNotification('Expense added successfully!');
        } else {
            showNotification('Error adding expense', true);
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        showNotification('Error adding expense', true);
    }
}

// Delete expense
async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/expenses/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadExpenses();
            loadSummary();
            showNotification('Expense deleted successfully!');
        } else {
            showNotification('Error deleting expense', true);
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        showNotification('Error deleting expense', true);
    }
}

// Load and display summary
async function loadSummary() {
    try {
        const response = await fetch(`${API_URL}/summary`);
        const summary = await response.json();

        // Update total
        document.getElementById('totalAmount').textContent = 
            `$${summary.total.toFixed(2)}`;

        // Update count
        document.getElementById('expenseCount').textContent = summary.count;

        // Display category breakdown
        displayBreakdown(summary.byCategory, summary.total);
    } catch (error) {
        console.error('Error loading summary:', error);
    }
}

// Display category breakdown
function displayBreakdown(byCategory, total) {
    const breakdownDiv = document.getElementById('categoryBreakdown');
    
    if (Object.keys(byCategory).length === 0) {
        breakdownDiv.innerHTML = '<div class="empty-state"><p>No data to display</p></div>';
        return;
    }

    // Sort by amount (highest first)
    const sorted = Object.entries(byCategory)
        .sort((a, b) => b[1] - a[1]);

    breakdownDiv.innerHTML = sorted.map(([category, amount]) => {
        const percentage = total > 0 ? (amount / total) * 100 : 0;
        return `
            <div class="breakdown-item">
                <div>
                    <div class="breakdown-category">${escapeHtml(category)}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
                <div class="breakdown-total">$${parseFloat(amount).toFixed(2)}</div>
            </div>
        `;
    }).join('');
}

// Utility functions
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${isError ? '#ff6b6b' : '#51cf66'};
        color: white;
        border-radius: 6px;
        z-index: 1000;
        animation: slideIn 0.3s ease-in-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations to style tag
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
