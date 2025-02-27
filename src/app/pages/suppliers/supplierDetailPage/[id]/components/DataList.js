'use client'
import React, { useState } from 'react'
import {
    PencilIcon,
    TrashIcon,
    TruckIcon,
} from "@heroicons/react/24/outline";
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from "react-icons/md";

const DataList = ({ data, handleEdit, handleDelete, handleStatusEdit, handleItemStatusEdit }) => {

    const [showDetails, setShowDetails] = useState(false); // Add a toggle state
    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    return (

        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start ">
                <div className='flex justify-center items-center mt-2'>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${data.status === 'Delivered'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}>
                        <button
                            onClick={() => handleStatusEdit(data)}>
                            {data.status}
                        </button>
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                        {new Date(data.date).toLocaleDateString()}
                    </span>

                </div>
                <div className="flex gap-2 justify-center items-center">
                    <button
                        className="text-yellow-500 hover:text-yellow-600"
                        onClick={() => handleEdit(data)}>
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(data._id)}
                        className="text-red-500 hover:text-red-600"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={toggleDetails}
                        className="px-4 py-2 rounded mt-2">
                        {showDetails ? <MdKeyboardDoubleArrowUp className="h-6 w-6 text-gray-500 hover:text-gray-600" />
                            : <MdKeyboardDoubleArrowDown className="h-6 w-6 text-gray-500 hover:text-gray-600" />}
                    </button>
                </div>
            </div>

            {/* Items Display */}
            {showDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {data?.items?.map((item, index) => (
                        <div key={index} className="border p-3 rounded-md">
                            <h4 className="font-medium">{item.itemName}</h4>
                            <p>Qty: {item.quantity}</p>
                            {item.price && <p>Per Price: Rs.{item.price}</p>}
                            {item.price && <p>Total Price: Rs.{(item.price * item.quantity)}</p>}
                            {item.date && <p className="text-sm text-gray-500">
                                {new Date(item.date).toLocaleDateString()}
                            </p>}
                            <span className={`inline-block px-3 py-1 rounded-full text-sm ${item.status === 'Delivered'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                }`}>
                                <button
                                    onClick={() => handleItemStatusEdit(data)}>
                                    {item.status}
                                </button>
                            </span>
                        </div>
                    ))}
                </div>
            )
            }
            {
                showDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {data?.transactions?.payments?.map((payment, index) => (
                            <div key={index} className="border p-3 rounded-md">
                                <h4 className="font-medium mb-2">Payment Details</h4>
                                <p className="text-sm">Partial Payment: Rs.{payment.amount}</p>
                                <p className="text-sm">Debit (Remaining Balance): Rs.{payment.debit}</p>
                                <p className="text-sm">Credit (Paid Amount): Rs.{payment.credit}</p>
                                {payment.invoice && payment.invoice !== "N/A" && (
                                    <p className="text-sm">
                                        Invoice:{" "}
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${payment.invoice}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            View
                                        </a>
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )
            }

            {
                showDetails && data.status === 'Delivered' && (
                    <div className="bg-blue-50 p-4 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                            <TruckIcon className="w-5 h-5 text-blue-600" />
                            <h4 className="font-medium">Transport Details</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm">Name: {data.driver.name}</p>
                            </div>
                            <div>
                                <p className="text-sm">Vehicle: {data.driver.vehicle}</p>
                            </div>
                            <div>
                                <p className="text-sm">Delivered: {new Date(data.date).toLocaleDateString()}</p>
                            </div>


                        </div>
                    </div>
                )
            }

        </div >
    )
}

export default DataList
