'use client'
import React, { useState, useEffect } from 'react'
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from 'axios';

const EditOrderForm = ({ setShowStatusForm, setShipmentsData, id, shipmentData }) => {


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
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${id}/shipment/${shipmentData._id}/status`, updatedData);

            if (response.status === 200) { 
                setShipmentsData(response.data.supplier.shipments);
                setShowStatusForm(false);
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
                    onClick={() => setShowStatusForm(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-semibold mb-4 text-center">Update Status</h2>

                <form encType="multipart/form-data" onSubmit={handleEditData} className="space-y-6 overflow-y-auto max-h-96">

                    {/* Status Section */}
                    <div className="border-b pb-4">
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
                    </div>

                    {/* Transport Form */}
                    {editData.status === 'Delivered' && (
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
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setShowStatusForm(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditOrderForm;