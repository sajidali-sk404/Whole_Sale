'use client'
import React, { useState } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const ShipmentDeleteConfirmation = ({ shipmentId, supplierId, setShowDeleteConfirm, setShipmentsData, setLoading, setError }) => {

    const confirmDelete = async () => {
        setLoading(true); // Set loading state *before* API call
        try {
            const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${supplierId}/shipment/${shipmentId}`, { // Protected route
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
                    'Content-Type': 'application/json', // Or any content type your API expects
                },
            });
            if (response.status === 200) {
                // Update shipments data *locally* for immediate feedback
                setShipmentsData(prevShipments => prevShipments.filter(shipment => shipment._id !== shipmentId));
                setShowDeleteConfirm(false); // Close the modal
            } else {
                console.error("Delete failed:", response);
                setError(`Failed to delete shipment: ${response.data?.message || 'Unknown error'}`); // Set error message
                setShowDeleteConfirm(false); // It's good practice to close the modal even on error
            }
        } catch (error) {
            console.error("Error during delete:", error);
            setError(`Error deleting shipment: ${error.response?.data?.message || 'Please try again.'}`); // Set error message
            setShowDeleteConfirm(false);  // Close modal on error
        } finally {
          setLoading(false);  // Clear loading state in all cases (success, error)
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
                <div className="flex justify-end">
                    <button
                        onClick={cancelDelete}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex items-center justify-center mb-4">
                    <FaExclamationTriangle className="text-red-500 text-4xl" />
                </div>
                <p className="text-lg text-gray-700 text-center mb-6">
                    Are you sure you want to delete this shipment? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={cancelDelete}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ShipmentDeleteConfirmation;