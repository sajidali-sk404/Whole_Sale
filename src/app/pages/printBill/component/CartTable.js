import React from 'react'

const CartTable = ({ cart, handleRemoveItem }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Action</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {cart.map((item, index) => (
                    <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">PKR {item.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">PKR {item.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <button
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            >
                                Remove
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default CartTable
