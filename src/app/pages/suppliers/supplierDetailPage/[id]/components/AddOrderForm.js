import React from 'react'
import { XMarkIcon } from "@heroicons/react/24/outline";

const AddOrderForm = ({setShowForm, handleAddData, setNewData, newData, handleItemChange, addNewItem, handleStatusChange}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-semibold mb-4 text-center">Create New Order</h2>

              <form onSubmit={handleAddData} className="space-y-6 overflow-y-auto max-h-96">
                {/* Items Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-4">Items Details</h3>
                  {newData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium">Item Name*</label>
                        <input
                          type="text"
                          value={item.itemName}
                          onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Quantity*</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Price</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>

                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addNewItem}
                    className="mt-2 text-blue-500 text-sm flex items-center"
                  >
                    <span className="mr-1">+ Add Another Item</span>
                  </button>
                </div>

                {/* Partial Payment */}
<div className="border-b pb-4">
  <h3 className="text-lg font-medium mb-4">Payment Details</h3>
  <div className="grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium">Partial Payment*</label>
      <input
        type="number"
        value={newData.partialPayment}
        onChange={(e) => setNewData(prev => ({ ...prev, partialPayment: e.target.value }))}
        className="w-full p-2 border rounded-md"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium">Upload Invoice*</label>
      <input
        type="file"
        onChange={(e) => setNewData(prev => ({ ...prev, invoice: e.target.files[0] }))}
        className="w-full p-2 border rounded-md"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium">Total Price</label>
      <input
        type="number"
        value={newData.items.reduce((acc, item) => acc + Number(item.price || 0), 0)}
        disabled
        className="w-full p-2 border rounded-md bg-gray-200"
      />
    </div>
  </div>
</div>

{/* Debit and Credit Section */}
<div className="border-b pb-4">
  <h3 className="text-lg font-medium mb-4">Debit & Credit</h3>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium">Debit (Total Price - Paid Amount)</label>
      <input
        type="number"
        value={newData.items.reduce((acc, item) => acc + Number(item.price || 0), 0) - newData.partialPayment}
        disabled
        className="w-full p-2 border rounded-md bg-gray-200"
      />
    </div>
    <div>
      <label className="block text-sm font-medium">Credit (Amount Paid)</label>
      <input
        type="number"
        value={newData.partialPayment}
        disabled
        className="w-full p-2 border rounded-md bg-gray-200"
      />
    </div>
  </div>
</div>


                {/* Status Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-4">Order Status</h3>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleStatusChange('pending')}
                      className={`px-4 py-2 rounded-md ${newData.status === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200'
                        }`}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange('delivered')}
                      className={`px-4 py-2 rounded-md ${newData.status === 'delivered'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200'
                        }`}
                    >
                      Delivered
                    </button>
                  </div>
                </div>

                {/* Transport Form */}
                {newData.status === 'delivered' && (
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-4">Transport Details</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium">Transport Name*</label>
                        <input
                          type="text"
                          value={newData.transportDetails.name}
                          onChange={(e) => handleTransportChange('name', e.target.value)}
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Driver Name*</label>
                        <input
                          type="text"
                          value={newData.transportDetails.driver}
                          onChange={(e) => handleTransportChange('driver', e.target.value)}
                          className="w-full p-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Delivery Date*</label>
                        <input
                          type="date"
                          value={newData.transportDetails.deliveryDate}
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
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Save Order
                  </button>
                </div>
              </form>
            </div>
          </div>
  )
}

export default AddOrderForm
