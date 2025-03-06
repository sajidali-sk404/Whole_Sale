'use client'
import React, { useState } from 'react'
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from "react-icons/md";
import { FaTruck, FaMoneyBillWave, FaBoxOpen, FaFileInvoice, FaCalendarAlt } from 'react-icons/fa';

const DataList = ({ data, handleDelete }) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
                <div className='flex items-center'>
                    <span className="text-sm text-gray-600 ml-2 flex items-center">
                         <FaCalendarAlt className="mr-1 text-gray-500" />
                        {new Date(data.date).toLocaleDateString()}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => handleDelete(data._id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        title="Delete"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={toggleDetails}
                        className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        title={showDetails ? "Hide Details" : "Show Details"}
                    >
                        {showDetails ? <MdKeyboardDoubleArrowUp className="w-6 h-6" /> : <MdKeyboardDoubleArrowDown className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Items Display */}
            {showDetails && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                        <FaBoxOpen className="mr-2 text-blue-600" />Items
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {data?.items?.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm font-medium text-gray-700">{item?.itemName}</p>
                                <p className="text-sm text-gray-600">Qty: {item?.quantity}</p>
                                {item.price && <p className="text-sm text-gray-600">Price: Rs.{item?.price}</p>}
                                {item.price && <p className="text-sm text-gray-600">Total: Rs.{item?.price * item.quantity}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Payments Display */}
            {showDetails && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                        <FaMoneyBillWave className="mr-2 text-blue-600" />Payments
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm text-gray-600">Total Amount: Rs.{data.payment.totalAmount}</p>
                                <p className="text-sm text-gray-600">Given Amount: Rs.{data.payment.givenAmount}</p>
                                <p className="text-sm text-gray-600">Date: {new Date(data.payment.paymentDate).toLocaleDateString()}</p>
                            </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataList;