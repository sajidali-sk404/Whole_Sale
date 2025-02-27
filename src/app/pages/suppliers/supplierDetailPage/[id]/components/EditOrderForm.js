'use client'
import React, { useState, useEffect } from 'react'
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from 'axios';

const EditOrderForm = ({ setShowEditForm, setShipmentsData, id, shipmentData, setShowForm }) => {


    const [editData, setEditData] = useState({
        date: new Date().toISOString().split('T')[0],
        items: [{
            itemName: "",
            quantity: 0,
            price: 0,
            status: "Pending",
        }],
        partialPayment: 0,
        invoice: null,
        transactions: {
            paymentDate: new Date().toISOString().split('T')[0],
            partialPayment: 0,
            invoice: "",
            totalAmount: 0,
            totalDebit: 0,
            totalCredit: 0,
            payments: []
        }
    });

    // useEffect to pre-populate form when shipmentData prop changes
    useEffect(() => {
        if (shipmentData) {
            setEditData({
                date: shipmentData.date ? new Date(shipmentData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                items: shipmentData.items || [{ itemName: "", quantity: 0, price: 0, status: "Pending" }],
                transactions: {
                    paymentDate: shipmentData.transactions?.paymentDate ? new Date(shipmentData.transactions.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    partialPayment: shipmentData.transactions?.partialPayment || 0,
                    invoice: shipmentData.transactions?.invoice || null,
                    totalAmount: shipmentData.transactions?.totalAmount || 0,
                    totalDebit: shipmentData.transactions?.totalDebit || 0,
                    totalCredit: shipmentData.transactions?.totalCredit || 0,
                    payments: shipmentData.transactions?.payments || []
                }
            });
        }
    }, [shipmentData]);

    const handleFileChange = (e) => {
        setEditData(prev => ({
            ...prev,
            transactions: {
                ...prev.transactions,
                invoice: e.target.files[0]
            }
        }));
    }

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...editData.items];
        updatedItems[index][field] = field === 'quantity' || field === 'price' ? Number(value) : value;
        setEditData(prev => ({
            ...prev,
            items: updatedItems
        }));
    };

    const addNewItem = () => {
        setEditData(prev => ({
            ...prev,
            items: [...prev.items, { itemName: "", quantity: "", price: "" }]
        }));
    };

    const handleItemStatusChange = (index, status) => {
        const updatedItems = [...editData.items];
        updatedItems[index].status = status;
        setEditData(prev => ({
          ...prev,
          items: updatedItems
        }));
      };

    const resetForm = () => {
        setEditData({
            date: new Date().toISOString().split('T')[0],
            items: [{ itemName: "", quantity: "", price: "", status: "Pending" }],
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

    const handleEditData = async (e) => {
        e.preventDefault();

        // Calculate total amount and payments
        const totalAmount = editData.items.reduce((acc, item) => acc + Number((item.price * item.quantity) || 0), 0);
        const totalPaid = editData.transactions.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0;
        const newTotalPaid = totalPaid + Number(editData.transactions.partialPayment || 0);
        const remainingDebit = totalAmount - newTotalPaid;

        const formData = new FormData();
        formData.append('date', editData.date);

        formData.append('items', JSON.stringify(editData.items));

        // Append transactions data
        formData.append('transactions[paymentDate]', editData.transactions.paymentDate);
        formData.append('transactions[partialPayment]', editData.transactions.partialPayment);
        formData.append('transactions[totalAmount]', totalAmount);
        formData.append('transactions[totalDebit]', remainingDebit);
        formData.append('transactions[totalCredit]', newTotalPaid);
        formData.append('invoice', editData.transactions.invoice);

        const payments = [
            ...editData.transactions.payments,
            {
                amount: Number(editData.transactions.partialPayment),
                paymentDate: new Date().toISOString(),
                debit: remainingDebit,
                credit: newTotalPaid
            }]

        formData.append('transactions[payments]', JSON.stringify(payments));

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${id}/shipment/${shipmentData._id}`, formData);

            if (response.status === 200) {
                setShipmentsData(response.data.supplier.shipments);
                setShowEditForm(false);
                setShowForm(false);
                resetForm();
            } else {
                throw new Error("Failed to update order");
            }
        } catch (error) {
            console.error("Error updating order:", error);
            alert(`Error updating order: ${error.response?.data?.message || 'Please try again.'}`);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative max-w-4xl w-full bg-white shadow-lg rounded-lg max-sm:p-2 p-6">
                <button
                    onClick={() => setShowEditForm(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-semibold mb-4 text-center">Update Order</h2>

                <form encType="multipart/form-data" onSubmit={handleEditData} className="space-y-6 overflow-y-auto max-h-96">
                    {/* Items Section */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-4">Items Details</h3>
                        {editData.items.map((item, index) => (
                            <div key={index} className="grid max-sm:grid-cols-3 grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium">Item Name*</label>
                                    <input
                                        type="text"
                                        value={item.itemName || ''}
                                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Quantity*</label>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Per Price</label>
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Total Price</label>
                                    <input
                                        type="number"
                                        value={item.price * item.quantity}
                                        className="w-full p-2 border rounded-md bg-gray-200"
                                        disabled
                                    />
                                </div>
                                {/* Status Buttons for each item */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleItemStatusChange(index, 'Pending')}
                                        className={`px-4 py-2 rounded-md ${item.status === 'Pending'
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-gray-200'
                                            }`}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleItemStatusChange(index, 'Delivered')}
                                        className={`px-4 py-2 rounded-md ${item.status === 'Delivered'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200'
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
                            className="mt-2 text-blue-500 text-sm flex items-center"
                        >
                            <span className="mr-1">+ Add Another Item</span>
                        </button>
                    </div>

                    {/* Payment Details */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-4">Payment Details</h3>

                        {/* Show Previous Payments */}
                        {editData.transactions.payments?.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-md font-semibold">Previous Payments</h4>
                                <ul className="space-y-2">
                                    {editData.transactions.payments.map((payment, index) => (
                                        <li key={index} className="bg-gray-100 p-2 rounded-md flex justify-between">
                                            <span>Amount: {payment.amount}</span>
                                            <span className="text-sm text-gray-600">Date: {new Date(payment.paymentDate).toLocaleDateString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* New Payment Input */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Partial Payment*</label>
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
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Upload Invoice*</label>
                                <input
                                    type="file"
                                    name="invoice"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Debit and Credit Section */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-4">Debit & Credit</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Debit (Remaining Balance)</label>
                                <input
                                    type="number"
                                    value={
                                        editData.items.reduce((acc, item) => acc + Number((item.price * item.quantity) || 0), 0) -
                                        (editData.transactions.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0) -
                                        Number(editData.transactions.partialPayment || 0)
                                    }
                                    disabled
                                    className="w-full p-2 border rounded-md bg-gray-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Credit (Total Amount Paid)</label>
                                <input
                                    type="number"
                                    value={
                                        (editData.transactions.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0) +
                                        Number(editData.transactions.partialPayment || 0)
                                    }
                                    disabled
                                    className="w-full p-2 border rounded-md bg-gray-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status Section */}
                    {/* <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-4">Order Status</h3>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => handleStatusChange('Pending')}
                                className={`px-4 py-2 rounded-md ${editData.status === 'Pending'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-200'
                                    }`}
                            >
                                Pending
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusChange('Delivered')}
                                className={`px-4 py-2 rounded-md ${editData.status === 'Delivered'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200'
                                    }`}
                            >
                                Delivered
                            </button>
                        </div>
                    </div> */}

                    {/* Transport Form */}
                    {/* {editData.status === 'Delivered' && (
                        <div className="border-b pb-4">
                            <h3 className="text-lg font-medium mb-4">Transport Details</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Driver Name*</label>
                                    <input
                                        type="text"
                                        value={editData.driver.name}
                                        onChange={(e) => handleTransportChange('name', e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Vehicle*</label>
                                    <input
                                        type="text"
                                        value={editData.driver.vehicle}
                                        onChange={(e) => handleTransportChange('vehicle', e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Delivery Date*</label>
                                    <input
                                        type="date"
                                        value={editData.date}
                                        onChange={(e) => handleTransportChange('deliveryDate', e.target.value)}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )} */}

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setShowEditForm(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                            Save Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditOrderForm;