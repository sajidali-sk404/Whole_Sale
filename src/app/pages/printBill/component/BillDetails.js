import React from 'react'
import {  TrashIcon } from "@heroicons/react/24/outline";
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp, MdPrint } from "react-icons/md";

const BillDetails = ({ bill, showDetails, toggleDetails, handleDeleteBill, handlePrint }) => (
        <div key={bill.invoiceNo} className="bg-gray-100 p-4 rounded-md shadow mb-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700">Invoice #{bill.invoiceNo}</h3>
                <div className="flex items-center">
                    <div>
                        <button
                            onClick={() => handleDeleteBill(bill.invoiceNo)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200 mr-4 flex items-center"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div>
                        <button onClick={() => handlePrint(bill)} className="text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-4 flex items-center">
                            <MdPrint className="mr-1" /> Print
                        </button>
                        <button onClick={() => toggleDetails(bill.invoiceNo)} className="text-gray-600 hover:text-gray-800 focus:outline-none transition-colors duration-200">
                            {showDetails[bill.invoiceNo] ? <MdKeyboardDoubleArrowUp className="h-6 w-6 text-gray-500" /> : <MdKeyboardDoubleArrowDown className="h-6 w-6 text-gray-500" />}
                        </button>
                    </div>

                </div>
            </div>
            {showDetails[bill.invoiceNo] && (
                <>
                <p className="text-gray-600"><strong>Customer:</strong> {bill.customerName}</p>
                <p className="text-gray-600"><strong>Date:</strong> {new Date(bill.date).toISOString().split('T')[0]}</p>
                <p className="text-gray-600"><strong>Total Amount:</strong> PKR {bill.totalAmount.toFixed(2)}</p>
                <p className="text-gray-600"><strong>Discount:</strong> {bill.discountPercentage}% (PKR {bill.discountAmount.toFixed(2)})</p>
                <p className="text-gray-600"><strong>Total After Discount:</strong> PKR {bill.totalAfterDiscount.toFixed(2)}</p>
                <p className="text-gray-600"><strong>Old Balance:</strong> PKR {bill.oldBalance.toFixed(2)}</p>

                <p className="text-gray-600"><strong>Net Amount:</strong> PKR {bill.netAmount.toFixed(2)}</p>
                <p className="text-gray-600"><strong>Given Amount:</strong> PKR {bill.customerGivenAmount.toFixed(2)}</p>
                <p className="text-gray-600"><strong>Remaining Amount:</strong> PKR {bill.debt.toFixed(2)}</p>

                {/* Display other bills details */}
                <div className="mt-2">
                    <h4 className="text-md font-semibold text-gray-700">Items:</h4>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">

                            {bill.cart.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">PKR {item.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">PKR {item.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}
    </div>
);

export default BillDetails
