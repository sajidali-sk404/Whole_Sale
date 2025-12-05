'use client'
import React, { useState } from 'react'
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaPlus, FaTruck, FaMoneyBillWave, FaClipboardCheck, FaFileInvoiceDollar, FaBoxOpen, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const AddOrderForm = ({ setShowForm, newData, setNewData, setShipmentsData, id }) => {

  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-500"></div>
      </div>
    );
  }

    const handleFileChange = (e) => {
        setNewData(prev => ({ ...prev, transactions: { ...prev.transactions, invoice: e.target.files[0] } }));
    }

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...newData.items];
        updatedItems[index][field] = field === 'quantity' || field === 'price' ? Number(value) : value;
        setNewData(prev => ({ ...prev, items: updatedItems }));
    };

    const handleItemStatusChange = (index, status) => {
        const updatedItems = [...newData.items];
        updatedItems[index].status = status;
        setNewData(prev => ({ ...prev, items: updatedItems }));
    };

    const addNewItem = () => {
        setNewData(prev => ({ ...prev, items: [...prev.items, { itemName: "", quantity: 0, price: 0, status: "Pending" }] }));
    };

    const handleStatusChange = (status) => {
        setNewData(prev => ({ ...prev, status: status }));
    };

    const handleTransportChange = (field, value) => {
        if (field === 'name' || field === 'vehicle') {
            setNewData(prev => ({ ...prev, driver: { ...prev.driver, [field]: value } }));
        }
        else if (field === 'deliveryDate') {
            setNewData(prev => ({ ...prev, date: value }));
        }
    };

    const resetForm = () => {
        setNewData({
            date: new Date().toISOString().split('T')[0],
            items: [{ itemName: "", quantity: "", price: "", status: "Pending", }],
            driver: { name: "", vehicle: "" },
            status: "Pending",
            transactions: {
                paymentDate: new Date().toISOString().split('T')[0],
                partialPayment: "",
                invoice: null,
                totalAmount: "",
                totalDebit: "",
                totalCredit: "",
                payments: []
            }
        });
    };

    const handleAddData = async (e) => {
        e.preventDefault();
        setLoading(true);

        const totalAmount = newData.items.reduce((acc, item) => acc + Number((item.price * item.quantity) || 0), 0);
        const totalPaid = newData.transactions.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0;
        const newTotalPaid = totalPaid + Number(newData.transactions.partialPayment || 0);
        const remainingDebit = totalAmount - newTotalPaid;

        const formData = new FormData();
        formData.append('date', newData.date);
        formData.append('items', JSON.stringify(newData.items));
        formData.append('driver[name]', newData.driver.name);
        formData.append('driver[vehicle]', newData.driver.vehicle);
        formData.append('status', newData.status);
        formData.append('transactions[paymentDate]', newData.transactions.paymentDate);
        formData.append('transactions[partialPayment]', newData.transactions.partialPayment);
        formData.append('transactions[totalAmount]', totalAmount);
        formData.append('transactions[totalDebit]', remainingDebit);
        formData.append('transactions[totalCredit]', newTotalPaid);

        if (newData.transactions.invoice) {
            formData.append('invoice', newData.transactions.invoice);
        }

        const payments = [
            ...newData.transactions.payments,
            {
                amount: Number(newData.transactions.partialPayment),
                invoice: newData.transactions.invoice,
                paymentDate: new Date().toISOString(),
                debit: remainingDebit,
                credit: newTotalPaid
            }
        ];
        formData.append('transactions[payments]', JSON.stringify(payments));

        try {
            const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/supplier/${id}/shipment`, formData, { // Protected route
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
                    'Content-Type': 'application/json', // Or any content type your API expects
                },
            });

            if (response.status === 201) {
                setLoading(false);
                setShipmentsData(response.data.supplier.shipments);
                resetForm();
                setShowForm(false);
            } else {
                throw new Error("Failed to add order");
            }
        } catch (error) {
            console.error("Error adding order:", error);
            alert(`Error adding order: ${error.response?.data?.message || 'Please try again.'}`);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative max-w-4xl w-full bg-white rounded-lg p-6 shadow-lg">
                <button
                    onClick={() => setShowForm(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Create New Order</h2>

                <form encType="multipart/form-data" onSubmit={handleAddData} className="space-y-4 overflow-y-auto max-h-[70vh]">
                   {/* Date input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 items-center">
                        <FaCalendarAlt className="mr-2 text-blue-600" /> Date
                      </label>
                      <input
                        type="date"
                        value={newData.date}
                        onChange={(e) => setNewData(prev => ({ ...prev, date: e.target.value }))}
                        className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300"
                      />
                    </div>

                    {/* Items Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FaBoxOpen className="mr-2 text-blue-600" />Items</h3>
                        {newData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-600">Item Name*</label>
                                    <input
                                        type="text"
                                        value={(item.itemName || '').toLowerCase()}
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
                        {newData.transactions.payments?.length > 0 && (
                            <div className="mb-2">
                                <h4 className="text-sm font-semibold text-gray-600">Previous Payments</h4>
                                <ul className="space-y-1">
                                    {newData.transactions.payments.map((payment, index) => (
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
                                    value={newData.transactions.partialPayment || ''}
                                    onChange={(e) => setNewData(prev => ({
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
                                    required
                                />
                            </div>
                        </div>
                    </div>

                     {/* Debit and Credit - Simplified Display */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Debit (Remaining)</label>
                            <div className="mt-1 block w-full py-1 px-2 text-sm text-gray-700 bg-gray-100 rounded-md">
                                {newData.items.reduce((acc, item) => acc + Number((item.price * item.quantity) || 0), 0) -
                                (newData.transactions.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0) -
                                Number(newData.transactions.partialPayment || 0)}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Credit (Paid)</label>
                            <div className="mt-1 block w-full py-1 px-2 text-sm text-gray-700 bg-gray-100 rounded-md">
                                {(newData.transactions.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0) +
                                Number(newData.transactions.partialPayment || 0)}
                            </div>
                        </div>
                    </div>

                    {/* Status Section */}
                    <div>
                         <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FaClipboardCheck className="mr-2 text-blue-600" />Status</h3>
                        <div className="flex gap-2">
                           <button
                                type="button"
                                onClick={() => handleStatusChange('Pending')}
                                className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${newData.status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : 'text-gray-500 hover:bg-yellow-50'
                                    }`}
                            >
                                Pending
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusChange('Delivered')}
                                className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${newData.status === 'Delivered'
                                    ? 'bg-green-100 text-green-600'
                                    : 'text-gray-500 hover:bg-green-50'
                                    }`}
                            >
                                Delivered
                            </button>
                        </div>
                    </div>

                    {/* Transport Form */}
                    {newData.status === 'Delivered' && (
                        <div>
                             <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FaTruck className="mr-2 text-blue-600" />Transport</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Driver Name*</label>
                                    <input
                                        type="text"
                                        value={newData.driver.name}
                                        onChange={(e) => handleTransportChange('name', e.target.value)}
                                        className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Vehicle*</label>
                                    <input
                                        type="text"
                                        value={newData.driver.vehicle}
                                        onChange={(e) => handleTransportChange('vehicle', e.target.value)}
                                        className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Delivery Date*</label>
                                    <input
                                        type="date"
                                        value={newData.date}
                                        onChange={(e) => handleTransportChange('deliveryDate', e.target.value)}
                                        className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4">
                         <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                        >
                            Save Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddOrderForm;