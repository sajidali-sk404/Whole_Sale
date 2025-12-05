'use client'
import React, { useState } from 'react'
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaPlus, FaTruck, FaMoneyBillWave, FaClipboardCheck, FaFileInvoiceDollar, FaBoxOpen, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const AddOrderForm = ({ setShowForm, newData, setNewData, setDeliveriesData, id, currentShopkeeper, fetchShopkeeperData }) => {

    const [loading, setLoading] = useState(false);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-auto">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const resetForm = () => {
        setNewData({
            date: new Date().toISOString().split('T')[0],
            items: [{ itemName: "", quantity: "", price: "" }],
            status: "Pending",
            payment: {
                paymentDate: new Date().toISOString().split('T')[0],
                totalAmount: "",
                givenAmount: "",
            }
        });
    };

    const handleAddData = async (e) => {
        e.preventDefault();
        setLoading(true);

        const totalAmount = 0;
        const totalPaid = Number(newData.payment.givenAmount);

        const totalDebit = currentShopkeeper?.totalDebit ? currentShopkeeper?.totalDebit + totalAmount - totalPaid : totalAmount - totalPaid;
        const totalCredit = currentShopkeeper?.totalCredit ? currentShopkeeper?.totalCredit + totalPaid : totalPaid;
        const subTotal = currentShopkeeper?.subTotal ? currentShopkeeper?.subTotal + totalAmount : totalAmount;

        const formData = {
            totalDebit: totalDebit,
            totalCredit: totalCredit,
            subTotal: subTotal,
            order: {
                date: newData.date,
                status: "Delivered",
                payment: {
                    paymentDate: newData.payment.date,
                    totalAmount: totalAmount,
                    givenAmount: totalPaid,
                }

            }
        }
        console.log(formData)

        try {
            const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/shopkeeper/${id}/delivery`, formData, { // Protected route
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
                    'Content-Type': 'application/json', // Or any content type your API expects
                },
            });

            if (response.status === 201) {
                setDeliveriesData(response.data.shopkeeper.orders);
                resetForm();
                setShowForm(false);
                fetchShopkeeperData();
            } else {
                throw new Error("Failed to add order");
            }
        } catch (error) {
            console.error("Error adding order:", error);
            alert(`Error adding order: ${error.response?.data?.message || 'Please try again.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative max-w-xl w-full bg-white rounded-lg p-6 shadow-lg">
                <button
                    onClick={() => setShowForm(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Add Credit</h2>

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

                    {/* Payment Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FaMoneyBillWave className="mr-2 text-blue-600" />Payment</h3>


                        <div>
                            <label className="block text-sm font-medium text-gray-600">Given Amount</label>
                            <input
                                type="number"
                                value={newData.payment.givenAmount || ''}
                                onChange={(e) => setNewData(prev => ({
                                    ...prev,
                                    payment: {
                                        givenAmount: e.target.value
                                    }
                                }))}
                                className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300"
                            />
                        </div>

                    </div>

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