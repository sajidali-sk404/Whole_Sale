import React from 'react'
import {
    PencilIcon,
    TrashIcon,
    TruckIcon,
} from "@heroicons/react/24/outline";

const DataList = ({ data, handleEdit, handleDelete }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${data.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {data.status}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                        {new Date(data.date).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        className="text-yellow-500 hover:text-yellow-600"
                        onClick={() => handleEdit(data.id)}>
                        <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(data.id)}
                        className="text-red-500 hover:text-red-600"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Items Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {data.items.map((item, index) => (
                    <div key={index} className="border p-3 rounded-md">
                        <h4 className="font-medium">{item.itemName}</h4>
                        <p>Qty: {item.quantity}</p>
                        {item.price && <p>Price: ₹{item.price}</p>}
                        {item.date && <p className="text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString()}
                        </p>}
                    </div>
                ))}
            </div>

            {/* Payment Details */}
            {/* <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-medium mb-2">Payment Details</h4>
                <p className="text-sm">Partial Payment: ₹{data.partialPayment}</p>
                <p className="text-sm">Debit (Remaining Balance): ₹{data.debit}</p>
                <p className="text-sm">Credit (Paid Amount): ₹{data.credit}</p>
                {data.invoice && <p className="text-sm">Invoice: <a href={URL.createObjectURL(data.invoice)} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View</a></p>}
            </div> */}
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {data.payments.map((payments, index) => (
                    <div key={index} className="border p-3 rounded-md">
                        <h4 className="font-medium mb-2">Payment Details</h4>
                        <p className="text-sm">Partial Payment: ₹{payments.amount}</p>
                        <p className="text-sm">Debit (Remaining Balance): ₹{payments.debit}</p>
                        <p className="text-sm">Credit (Paid Amount): ₹{payments.credit}</p>
                        {payments.invoice && <p className="text-sm">Invoice: <a href={URL.createObjectURL(payments.invoice)} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View</a></p>}
                    </div>
                ))}
            </div>


            {/* Transport Details */}
            {data.status === 'delivered' && (
                <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                        <TruckIcon className="w-5 h-5 text-blue-600" />
                        <h4 className="font-medium">Transport Details</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm">Transport: {data.transportDetails.name}</p>
                        </div>
                        <div>
                            <p className="text-sm">Driver: {data.transportDetails.driver}</p>
                        </div>
                        <div>
                            <p className="text-sm">Delivered: {new Date(data.transportDetails.deliveryDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DataList
