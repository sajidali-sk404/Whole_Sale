// EditItemStatusForm.js
'use client'
import React, { useState, useEffect } from 'react'
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaBoxOpen } from 'react-icons/fa'; // Correct import
import axios from 'axios';

const EditItemStatusForm = ({ setShowItemStatusForm, setShipmentsData, id, shipmentData }) => {


    const [editData, setEditData] = useState({
        items: [{
            itemName: "",
            quantity: 0,
            price: 0,
            status: "Pending",
        }],
        date: new Date().toISOString().split('T')[0],
        driver: {
            name: "",
            vehicle: ""
        },
        status: "Pending"
    });

    // useEffect to pre-populate form when shipmentData prop changes
    useEffect(() => {
        if (shipmentData) {
            setEditData({
                items: shipmentData.items || [{ itemName: "", quantity: 0, price: 0, status: "Pending" }],
                date: shipmentData.date ? new Date(shipmentData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                driver: shipmentData.driver || { name: "", vehicle: "" },
                status: shipmentData.status || "Pending",
            });
        }
    }, [shipmentData]);

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
            items: [{ itemName: "", quantity: "", price: "", status: "Pending" }]
        });
    };

    const handleEditData = async (e) => {
        e.preventDefault();

        const updatedData = {
            items: editData.items,
            date: editData.date,
            driver: {
                name: editData.driver.name,
                vehicle: editData.driver.vehicle
            },
            status: editData.status
        };

        try {
            const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${id}/shipment/${shipmentData._id}/status`, updatedData, { // Protected route
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
                    'Content-Type': 'application/json', // Or any content type your API expects
                },
            });

            if (response.status === 200) {
                setShipmentsData(response.data.supplier.shipments);
                setShowItemStatusForm(false);
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
            <div className="relative max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <button
                    onClick={() => setShowItemStatusForm(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Update Item Status</h2>

                <form onSubmit={handleEditData} className="space-y-4">
                    {/* Items Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FaBoxOpen className='mr-2 text-blue-600'/>Items Status</h3>
                        {editData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4 items-center mb-2">
                                {/* Item Name */}
                                <p className="text-sm font-medium text-gray-700">{item.itemName}</p>

                                {/* Status Buttons */}
                                <div className="flex gap-2">
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
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setShowItemStatusForm(false)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditItemStatusForm;