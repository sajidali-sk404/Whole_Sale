'use client'

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '@/app/ContextApi/AuthContextApi';

const Expenses = () => {
    const { isAuthenticated, userRole } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('');
    const [editExpenseId, setEditExpenseId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedDates, setExpandedDates] = useState({}); // Tracks which dates are expanded

    useEffect(() => {
        if (!isAuthenticated || userRole === 'user') {
            if (typeof window !== 'undefined') {
                window.location.href = "/";
            }
        }
    }, [isAuthenticated, userRole]);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setLoading(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses`, { // Protected route
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
                    'Content-Type': 'application/json', // Or any content type your API expects
                },
            });
            setExpenses(response.data);
        } catch (err) {
            console.error("Error fetching expenses:", err);
            setError(err.message || "Failed to fetch expenses");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!description || !amount || !date || !category) {
            alert('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setError(null);

        const expenseData = {
            date,
            category,
            description,
            amount: parseFloat(amount),
        };

        try {
            if (editExpenseId) {
                const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/${editExpenseId}`, expenseData, { // Protected route
                    headers: {
                        'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
                        'Content-Type': 'application/json', // Or any content type your API expects
                    },
                });
            } else {
                const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses`, expenseData, { // Protected route
                    headers: {
                        'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
                        'Content-Type': 'application/json', // Or any content type your API expects
                    },
                });
            }
            fetchExpenses();
            setDescription('');
            setAmount('');
            setDate('');
            setCategory('');
            setEditExpenseId(null);
        } catch (err) {
            console.error("Error saving expense:", err);
            setError(err.message || "Failed to save expense");
        } finally {
            setLoading(false);
        }
    }, [editExpenseId, setDescription, setAmount, setDate, setCategory, description, amount, date, category]);

    const handleDelete = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/${id}`, { // Protected route
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
                    'Content-Type': 'application/json', // Or any content type your API expects
                },
            });
            fetchExpenses();
        } catch (err) {
            console.error("Error deleting expense:", err);
            setError(err.message || "Failed to delete expense");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleEdit = useCallback(async (id) => {
        const expenseToEdit = expenses.find(expense => expense._id === id);
        if (expenseToEdit) {
            setEditExpenseId(expenseToEdit._id);
            setDescription(expenseToEdit.description);
            setAmount(expenseToEdit.amount.toString());
            setDate(expenseToEdit.date.split('T')[0]);
            setCategory(expenseToEdit.category);
        }
    }, [expenses, setEditExpenseId, setDescription, setAmount, setDate, setCategory]);

    const toggleDateExpenses = (date) => {
        setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }));
    };

    const groupExpensesByDate = () => {
        const grouped = {};
        expenses.forEach(expense => {
            const date = expense.date.split('T')[0];
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(expense);
        });
        return grouped;
    };

    const groupedExpenses = groupExpensesByDate();

    const formatCurrency = (amount) => {
        return `Rs. ${amount.toFixed(0)}`;
    };

    const calculateDailyTotal = (date) => {
        const dailyExpenses = groupedExpenses[date] || [];
        return dailyExpenses.reduce((total, expense) => total + expense.amount, 0);
    };

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

    if (!isAuthenticated || userRole === 'user') return null;

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
                                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                                <select
                                    id="category"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Shop Rent">Shop Rent</option>
                                    <option value="Electricity Bills">Electricity Bills</option>
                                    <option value="Tea and Food">Tea and Food</option>
                                    <option value="Salaries">Salariess</option>
                                    <option value="Supplies">Supplies</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
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
                                {Object.entries(groupedExpenses).map(([date, dailyExpenses]) => (
                                    <React.Fragment key={date}>
                                        <tr
                                            className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                                            onClick={() => toggleDateExpenses(date)}
                                        >
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {expandedDates[date] ? (
                                                        <FaChevronDown className="text-blue-600" />
                                                    ) : (
                                                        <FaChevronRight className="text-blue-600" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap" colSpan="5">
                                                <div className="text-lg font-semibold text-gray-900">
                                                    {date} ({dailyExpenses.length} Expenses)
                                                    {expandedDates[date] && (
                                                        <span className="ml-4">
                                                            Total: {formatCurrency(calculateDailyTotal(date))}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedDates[date] &&
                                            dailyExpenses.map(expense => (
                                                <tr key={expense._id} className="bg-gray-50">
                                                    <td></td>
                                                    <td className="py-4 px-6">{expense.description}</td>
                                                    <td className="py-4 px-6">{formatCurrency(expense.amount)}</td>
                                                    <td className="py-4 px-6">{expense.date.split('T')[0]}</td>
                                                    <td className="py-4 px-6">{expense.category}</td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex justify-start gap-2">
                                                            <button
                                                                onClick={() => handleEdit(expense._id)}
                                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(expense._id)}
                                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Expenses;