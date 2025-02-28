'use client'
import React, { useState, useEffect } from 'react'
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaPlus, FaMoneyBillWave, FaFileInvoiceDollar, FaBoxOpen, FaCalendarAlt } from 'react-icons/fa'; // Correct imports
import axios from 'axios';

const EditOrderForm = ({ setShowEditForm, setShipmentsData, id, shipmentData, setShowForm }) => {

    const [editData, setEditData] = useState({
        date: new Date().toISOString().split('T')[0],
        items: [{ itemName: "", quantity: 0, price: 0, status: "Pending", }],
        // Removed: driver, status
        transactions: {
            paymentDate: new Date().toISOString().split('T')[0],
            partialPayment: 0,
            invoice: null,
            totalAmount: 0,
            totalDebit: 0,
            totalCredit: 0,
            payments: []
        }
    });

    useEffect(() => {
        if (shipmentData) {
            const items = shipmentData.items || [];
            const transactions = shipmentData.transactions || {};
            // Removed: driver, status

            setEditData({
                date: shipmentData.date ? new Date(shipmentData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                items: items.length > 0 ? items : [{ itemName: "", quantity: 0, price: 0, status: "Pending" }],
                // Removed: driver, status
                transactions: {
                    paymentDate: transactions.paymentDate ? new Date(transactions.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    partialPayment: transactions.partialPayment || 0,
                    invoice: transactions.invoice || null,
                    totalAmount: transactions.totalAmount || 0,
                    totalDebit: transactions.totalDebit || 0,
                    totalCredit: transactions.totalCredit || 0,
                    payments: transactions.payments || []
                }
            });
        }
    }, [shipmentData]);

    const handleFileChange = (e) => {
        setEditData(prev => ({ ...prev, transactions: { ...prev.transactions, invoice: e.target.files[0] } }));
    }

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...editData.items];
        updatedItems[index][field] = field === 'quantity' || field === 'price' ? Number(value) : value;
        setEditData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleItemStatusChange = (index, status) => {
        const updatedItems = [...editData.items];
        updatedItems[index].status = status;
        setEditData(prev => ({ ...prev, items: updatedItems }));
    };

    const addNewItem = () => {
        setEditData(prev => ({ ...prev, items: [...prev.items, { itemName: "", quantity: 0, price: 0, status: "Pending" }] }));
    };

    // Removed: handleStatusChange
    // Removed: handleTransportChange

    const resetForm = () => { // Keep this for consistency
        setEditData({
            date: new Date().toISOString().split('T')[0],
            items: [{ itemName: "", quantity: 0, price: 0, status: "Pending" }],
            transactions: {
                paymentDate: new Date().toISOString().split('T')[0],
                partialPayment: 0,
                invoice: null,
                totalAmount: 0,
                totalDebit: 0,
                totalCredit: 0,
                payments: []
            }
        });
    }

    const handleEditData = async (e) => {
        e.preventDefault();
        setLoading(true);

        const totalAmount = editData.items.reduce((acc, item) => acc + Number((item.price * item.quantity) || 0), 0);
        const totalPaid = editData.transactions.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0;
        const newTotalPaid = totalPaid + Number(editData.transactions.partialPayment || 0);
        const remainingDebit = totalAmount - newTotalPaid;

        const formData = new FormData();
        formData.append('date', editData.date);
        formData.append('items', JSON.stringify(editData.items));
        // Removed: driver, status
        formData.append('transactions[paymentDate]', editData.transactions.paymentDate);
        formData.append('transactions[partialPayment]', editData.transactions.partialPayment);
        formData.append('transactions[totalAmount]', totalAmount);
        formData.append('transactions[totalDebit]', remainingDebit);
        formData.append('transactions[totalCredit]', newTotalPaid);
        if (editData.transactions.invoice instanceof File) {
            formData.append('invoice', editData.transactions.invoice);
        }

        const payments = [
            ...editData.transactions.payments,
            {
                amount: Number(editData.transactions.partialPayment),
                paymentDate: new Date().toISOString(),
                debit: remainingDebit,
                credit: newTotalPaid
            }
        ];

        if(editData.transactions.partialPayment){
          formData.append('transactions[payments]', JSON.stringify(payments));
        } else {
          formData.append('transactions[payments]', JSON.stringify(editData.transactions.payments));
        }

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${id}/shipment/${shipmentData._id}`, formData);

            if (response.status === 200) {
                setLoading(false);
                setShipmentsData(response.data.supplier.shipments);
                setShowEditForm(false);
                setShowForm(false);
                // resetForm(); No need here.
            } else {
                throw new Error("Failed to update order");
            }
        } catch (error) {
            console.error("Error updating order:", error);
            alert(`Error updating order: ${error.response?.data?.message || 'Please try again.'}`);
        }
    };

    const [loading, setLoading] = useState(false);
    
      if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-500"></div>
          </div>
        );
      }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative max-w-4xl w-full bg-white rounded-lg p-6 shadow-lg">
                <button
                    onClick={() => setShowEditForm(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Update Order</h2>

                <form encType="multipart/form-data" onSubmit={handleEditData} className="space-y-4 overflow-y-auto max-h-[70vh]">
                    {/* Date input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 items-center">
                            <FaCalendarAlt className="mr-2 text-blue-600" /> Date
                        </label>
                        <input
                            type="date"
                            value={editData.date}
                            onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
                            className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300"
                        />
                    </div>

                    {/* Items Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FaBoxOpen className="mr-2 text-blue-600" />Items</h3>
                        {editData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-600">Item Name*</label>
                                    <input
                                        type="text"
                                        value={item.itemName || ''}
                                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                        className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-600">Quantity*</label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-600">Price</label>
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                        className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300"
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-600">Total</label>
                                    <input
                                        type="number"
                                        value={item.price * item.quantity}
                                        className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none  text-sm border-gray-300 bg-gray-100"
                                        disabled
                                    />
                                </div>
                                 {/* Status Buttons - Simpler Styling */}
                                <div className="md:col-span-4 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleItemStatusChange(index, 'Pending')}
                                        className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${item.status === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-600'
                                            : 'text-gray-500 hover:bg-yellow-50'
                                            }`}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleItemStatusChange(index, 'Delivered')}
                                        className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${item.status === 'Delivered'
                                            ? 'bg-green-100 text-green-600'
                                            : 'text-gray-500 hover:bg-green-50'
                                            }`}
                                    >
                                        Delivered
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addNewItem}
                            className="mt-1 text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm flex items-center"
                        >
                            <FaPlus className="mr-1 text-xs" /> Add Item
                        </button>
                    </div>

                    {/* Payment Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FaMoneyBillWave className="mr-2 text-blue-600" />Payment</h3>

                       {/* Simplified Previous Payments Display */}
                        {editData.transactions.payments?.length > 0 && (
                            <div className="mb-2">
                                <h4 className="text-sm font-semibold text-gray-600">Previous Payments</h4>
                                <ul className="space-y-1">
                                    {editData.transactions.payments.map((payment, index) => (
                                        <li key={index} className="text-sm text-gray-600">
                                            {new Date(payment.paymentDate).toLocaleDateString()} - Rs {payment.amount}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Partial Payment*</label>
                                <input
                                    type="number"
                                    value={editData.transactions.partialPayment || ''}
                                    onChange={(e) => setEditData(prev => ({
                                        ...prev,
                                        transactions: {
                                            ...prev.transactions,
                                            partialPayment: e.target.value
                                        }
                                    }))}
                                    className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300"
                                />
                            </div>

                            <div>
                                 <label className="block text-sm font-medium text-gray-600 items-center"><FaFileInvoiceDollar className="mr-2 text-blue-600" />Invoice*</label>
                                <input
                                    type="file"
                                    name="invoice"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300 file:bg-gray-50 file:border-none file:py-1 file:px-4 file:mr-4 file:rounded-md file:text-sm file:text-blue-700"

                                />
                            </div>
                        </div>
                    </div>

                     {/* Debit and Credit - Simplified Display */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Debit (Remaining)</label>
                            <div className="mt-1 block w-full py-1 px-2 text-sm text-gray-700 bg-gray-100 rounded-md">
                                {editData.items.reduce((acc, item) => acc + Number((item.price * item.quantity) || 0), 0) -
                                (editData.transactions.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0) -
                                Number(editData.transactions.partialPayment || 0)}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Credit (Paid)</label>
                            <div className="mt-1 block w-full py-1 px-2 text-sm text-gray-700 bg-gray-100 rounded-md">
                                {(editData.transactions.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0) +
                                Number(editData.transactions.partialPayment || 0)}
                            </div>
                        </div>
                    </div>

                  {/* Removed Status Section */}
                  {/* Removed Transport Section */}

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => setShowEditForm(false)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditOrderForm;