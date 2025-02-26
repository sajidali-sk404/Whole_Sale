'use client'
import React, { useState } from 'react'
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from 'axios';

const AddOrderForm = ({ setShowForm, newData, setNewData, setShipmentsData, id }) => {

  const handleFileChange = (e) => {
    setNewData(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        invoice: e.target.files[0]
      }
    }));
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newData.items];
    updatedItems[index][field] = field === 'quantity' || field === 'price' ? Number(value) : value;
    setNewData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addNewItem = () => {
    setNewData(prev => ({
      ...prev,
      items: [...prev.items, { itemName: "", quantity: 0, price: 0 }]
    }));
  };

  const handleStatusChange = (status) => {
    setNewData(prev => ({
      ...prev,
      status: status
    }));
  };

  const handleTransportChange = (field, value) => {
    if (field === 'name' || field === 'vehicle') {
      setNewData(prev => ({
        ...prev,
        driver: {
          ...prev.driver,
          [field]: value
        }
      }));
    }
    else if (field === 'deliveryDate') {
      setNewData(prev => ({
        ...prev,
        date: value
      }));
    }
  };

  const resetForm = () => {
    setNewData({
      date: new Date().toISOString().split('T')[0],
      items: [{ itemName: "", quantity: "", price: "" }],
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

    // Calculate total amount and payments
    const totalAmount = newData.items.reduce((acc, item) => acc + Number((item.price * item.quantity) || 0), 0);
    const totalPaid = newData.transactions.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0;
    const newTotalPaid = totalPaid + Number(newData.transactions.partialPayment || 0);
    const remainingDebit = totalAmount - newTotalPaid;

    const formData = new FormData();
    formData.append('date', newData.date);

    // Append items as JSON string (backend needs to parse it if it expects array)
    formData.append('items', JSON.stringify(newData.items)); // Important: Stringify items array

    formData.append('driver[name]', newData.driver.name); // Append nested driver fields
    formData.append('driver[vehicle]', newData.driver.vehicle);
    formData.append('status', newData.status);

    // Append transactions data
    formData.append('transactions[paymentDate]', newData.transactions.paymentDate);
    formData.append('transactions[partialPayment]', newData.transactions.partialPayment);
    formData.append('transactions[totalAmount]', totalAmount);
    formData.append('transactions[totalDebit]', remainingDebit);
    formData.append('transactions[totalCredit]', newTotalPaid);

    const payments = [
      ...newData.transactions.payments,
      {
        amount: Number(newData.transactions.partialPayment),
        invoice: newData.transactions.invoice,
        paymentDate: new Date().toISOString(),
        debit: remainingDebit,
        credit: newTotalPaid
      }]

    // Append payments array as JSON string (backend needs to parse it if it expects array)
    formData.append('transactions[payments]', JSON.stringify(payments));

    // Append the invoice file.
    if (newData.transactions.invoice) {

      // 'invoice' is the field name multer is looking for
      formData.append('invoice', newData.transactions.invoice);

    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${id}/shipment`, formData);

      if (response.status === 201) {

        // Update local state with new data
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
      <div className="relative max-w-4xl w-full bg-white shadow-lg rounded-lg max-sm:p-2 p-6">
        <button
          onClick={() => setShowForm(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Create New Order</h2>

        <form encType="multipart/form-data" onSubmit={handleAddData} className="space-y-6 overflow-y-auto max-h-96">
          {/* Items Section */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-4">Items Details</h3>
            {newData.items.map((item, index) => (
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
            {newData.transactions.payments?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-md font-semibold">Previous Payments</h4>
                <ul className="space-y-2">
                  {newData.transactions.payments.map((payment, index) => (
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
                  value={newData.transactions.partialPayment || ''}
                  onChange={(e) => setNewData(prev => ({
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
                    newData.items.reduce((acc, item) => acc + Number((item.price * item.quantity) || 0), 0) -
                    (newData.transactions.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0) -
                    Number(newData.transactions.partialPayment || 0)
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
                    (newData.transactions.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0) +
                    Number(newData.transactions.partialPayment || 0)
                  }
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-4">Order Status</h3>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleStatusChange('Pending')}
                className={`px-4 py-2 rounded-md ${newData.status === 'Pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200'
                  }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('Delivered')}
                className={`px-4 py-2 rounded-md ${newData.status === 'Delivered'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
                  }`}
              >
                Delivered
              </button>
            </div>
          </div>

          {/* Transport Form */}
          {newData.status === 'Delivered' && (
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium mb-4">Transport Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">Driver Name*</label>
                  <input
                    type="text"
                    value={newData.driver.name}
                    onChange={(e) => handleTransportChange('name', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Vehicle*</label>
                  <input
                    type="text"
                    value={newData.driver.vehicle}
                    onChange={(e) => handleTransportChange('vehicle', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Delivery Date*</label>
                  <input
                    type="date"
                    value={newData.date}
                    onChange={(e) => handleTransportChange('deliveryDate', e.target.value)}
                    className="w-full p-2 border rounded-md"
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

export default AddOrderForm;