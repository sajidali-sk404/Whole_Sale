'use client'
import React, { useState, useEffect } from 'react'
import { XMarkIcon } from "@heroicons/react/24/outline";
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
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${id}/shipment/${shipmentData._id}/status`, updatedData);

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
            <div className="relative max-w-4xl w-full bg-white shadow-lg rounded-lg max-sm:p-2 p-6">
                <button
                    onClick={() => setShowItemStatusForm(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-semibold mb-4 text-center">Update Item Status</h2>

                <form encType="multipart/form-data" onSubmit={handleEditData} className="space-y-6 overflow-y-auto max-h-96">
                    {/* Items Section */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-4">Items Status</h3>
                        {editData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                                
                                {/* Item Name */}
                                <h1>{item.itemName}</h1>

                                {/* Status Buttons*/}
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
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setShowItemStatusForm(false)}
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

export default EditItemStatusForm;