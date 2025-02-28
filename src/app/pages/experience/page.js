// pages/expenses.js
'use client';
// pages/expenses.js


// pages/expenses.js

// pages/expenses.js

// pages/expenses.js

// pages/expenses.js

// pages/expenses.js

// pages/expenses.js

import React, { useState, useCallback } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronRight } from 'react-icons/fa';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [editExpenseId, setEditExpenseId] = useState(null);
    const [loading, setLoading] = useState(false); // Added loading state
    const [error, setError] = useState(null); // Added error state
    const [expandedExpenses, setExpandedExpenses] = useState({});

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!description || !amount || !date || !category) {
            alert('Please fill in all fields.');
            return;
        }

        const newExpense = {
            id: editExpenseId || Date.now(),
            description,
            amount: parseFloat(amount),
            date,
            category,
        };

        if (editExpenseId) {
            setExpenses(expenses.map(expense => expense.id === editExpenseId ? newExpense : expense));
            setEditExpenseId(null);
        } else {
            setExpenses([...expenses, newExpense]);
        }

        setDescription('');
        setAmount('');
        setDate('');
        setCategory('');
    }, [editExpenseId, expenses, setDescription, setAmount, setDate, setCategory, setExpenses, description, amount, date, category]);

    const handleDelete = useCallback((id) => {
        setExpenses(expenses.filter((expense) => expense.id !== id));
    }, [setExpenses, expenses]);

    const handleEdit = useCallback((id) => {
        const expenseToEdit = expenses.find(expense => expense.id === id);
        if (expenseToEdit) {
            setEditExpenseId(id);
            setDescription(expenseToEdit.description);
            setAmount(expenseToEdit.amount.toString());
            setDate(expenseToEdit.date);
            setCategory(expenseToEdit.category);
        }
    }, [expenses, setEditExpenseId, setDescription, setAmount, setDate, setCategory]);

    const toggleExpanded = (expenseId) => {
      setExpandedExpenses((prevExpanded) => ({
        ...prevExpanded,
        [expenseId]: !prevExpanded[expenseId],
      }));
    };

    // Basic currency formatting (without currency.js)
    const formatCurrency = (amount) => {
        return `Rs. ${amount.toFixed(0)}`; // Adjust as needed for decimal places
    };

    // Loading and error handling
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-xl">Error: {error}</div>
        </div>
      );
    }

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">Expense Tracker</h1>
                <p className="text-gray-600 mb-8">Manage and track your expenses with ease.</p>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add/Edit Expense</h2>
                    <form onSubmit={handleSubmit} className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                                <input
                                    type="text"
                                    id="description"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter description"
                                />
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">Amount:</label>
                                <input
                                    type="number"
                                    id="amount"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                />
                            </div>
                            <div>
                                <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
                                <input
                                    type="date"
                                    id="date"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                                <select
                                    id="category"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    <option value="food">Food</option>
                                    <option value="transport">Transport</option>
                                    <option value="utilities">Utilities</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                        >
                            {editExpenseId ? 'Update Expense' : 'Add Expense'}
                        </button>
                        {editExpenseId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditExpenseId(null);
                                    setDescription('');
                                    setAmount('');
                                    setDate('');
                                    setCategory('');
                                }}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 ml-2"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>
                </div>

                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Expenses List</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {expenses.length > 0 ? (
                                    expenses.map((expense) => (
                                        <tr key={expense.id} className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
                                            <td className="py-4 px-6 whitespace-nowrap" onClick={() => toggleExpanded(expense.id)}>
                                                <div className="flex items-center">
                                                    {expandedExpenses[expense.id] ? (
                                                        <FaChevronDown className="text-blue-600" />
                                                    ) : (
                                                        <FaChevronRight className="text-blue-600" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap" onClick={() => toggleExpanded(expense.id)}>
                                                <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                {formatCurrency(expense.amount)}
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                {expense.date}
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                {expense.category}
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="flex justify-start gap-2">
                                                    <button
                                                        onClick={() => handleEdit(expense.id)}
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(expense.id)}
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-4 px-6 text-center text-gray-500">
                                            No expenses added yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expenses;