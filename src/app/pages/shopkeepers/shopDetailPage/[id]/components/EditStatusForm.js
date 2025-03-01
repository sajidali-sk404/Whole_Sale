'use client'
import React, { useState, useEffect } from 'react'
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaTruck } from 'react-icons/fa';

import axios from 'axios';

const EditStatusForm = ({ setShowStatusForm, setDeliveriesData, id, deliveryData }) => {


    const [editData, setEditData] = useState({
        date: new Date().toISOString().split('T')[0],
        driver: {
            name: "",
            vehicle: ""
        },
        status: "Pending",
        items: [{
            itemName: "",
            quantity: 0,
            price: 0,
            status: "Pending",
        }],
    });

    useEffect(() => {
        if (deliveryData) {
            setEditData({
                items: deliveryData.items || [{ itemName: "", quantity: 0, price: 0, status: "Pending" }],
                date: deliveryData.date ? new Date(deliveryData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                driver: deliveryData.driver || { name: "", vehicle: "" },
                status: deliveryData.status || "Pending",
            });
        }
    }, [deliveryData]);

    const handleStatusChange = (status) => {
        setEditData(prev => ({
            ...prev,
            status: status
        }));
    };

    const handleTransportChange = (field, value) => {
        if (field === 'name' || field === 'vehicle') {
            setEditData(prev => ({
                ...prev,
                driver: {
                    ...prev.driver,
                    [field]: value
                }
            }));
        }
        else if (field === 'deliveryDate') {
            setEditData(prev => ({
                ...prev,
                date: value
            }));
        }
    };

    const resetForm = () => {
        setEditData({
            driver: { name: "", vehicle: "" },
            status: "Pending"
        });
    };

    const handleEditData = async (e) => {
        setLoading(true);
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
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/shopkeeper/${id}/delivery/${deliveryData._id}/status`, updatedData);

            if (response.status === 200) {
                setDeliveriesData(response.data.shopkeeper.deliveries);
                setShowStatusForm(false);
                resetForm();
            } else {
                throw new Error("Failed to update order");
            }
        } catch (error) {
            console.error("Error updating order:", error);
            alert(`Error updating order: ${error.response?.data?.message || 'Please try again.'}`);
        } finally {
            setLoading(false);
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
            <div className="relative max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <button
                    onClick={() => setShowStatusForm(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Update Status</h2>

                <form onSubmit={handleEditData} className="space-y-4">

                    {/* Status Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">Order Status</h3>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleStatusChange('Pending')}
                                className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${editData.status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : 'text-gray-500 hover:bg-yellow-50'
                                    }`}
                            >
                                Pending
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusChange('Delivered')}
                                className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${editData.status === 'Delivered'
                                    ? 'bg-green-100 text-green-600'
                                    : 'text-gray-500 hover:bg-green-50'
                                    }`}
                            >
                                Delivered
                            </button>
                        </div>
                    </div>

                    {/* Transport Form */}
                    {editData.status === 'Delivered' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><FaTruck className='mr-2 text-blue-600' />Transport Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Driver Name*</label>
                                    <input
                                        type="text"
                                        value={editData.driver.name}
                                        onChange={(e) => handleTransportChange('name', e.target.value)}
                                        className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Vehicle*</label>
                                    <input
                                        type="text"
                                        value={editData.driver.vehicle}
                                        onChange={(e) => handleTransportChange('vehicle', e.target.value)}
                                        className="mt-1 block w-full border rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm border-gray-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Delivery Date*</label>
                                    <input
                                        type="date"
                                        value={editData.date}
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
                            onClick={() => setShowStatusForm(false)}
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

export default EditStatusForm;