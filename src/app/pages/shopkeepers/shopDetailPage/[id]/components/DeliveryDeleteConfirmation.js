'use client'
import React, { useState } from 'react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const DeliveryDeleteConfirmation = ({ deliveryId, shopkeeperId, setShowDeleteConfirm, setDeliveriesData, setLoading, setError }) => {

    const confirmDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/shopkeeper/${shopkeeperId}/delivery/${deliveryId}`);
            if (response.status === 200) {
                setDeliveriesData(prevDeliveries => prevDeliveries.filter(delivery => delivery._id !== deliveryId));
                setShowDeleteConfirm(false);
            } else {
                console.error("Delete failed:", response);
                setError(`Failed to delete delivery: ${response.data?.message || 'Unknown error'}`);
                setShowDeleteConfirm(false);
            }
        } catch (error) {
            console.error("Error during delete:", error);
            setError(`Error deleting delivery: ${error.response?.data?.message || 'Please try again.'}`);
            setShowDeleteConfirm(false);
        } finally {
            setLoading(false);
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
                    Are you sure you want to delete this delivery? This action cannot be undone.
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

export default DeliveryDeleteConfirmation;