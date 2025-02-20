'use client'
import React, { useState, useContext, useMemo, use, useEffect } from "react";
import { CompanyContext } from '@/app/ContextApi/companiesDataApi';
import { XMarkIcon, PencilIcon, TrashIcon, TruckIcon, CheckBadgeIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
const Page = ({ params }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const param = use(params);

  const { companies, setCompanies } = useContext(CompanyContext);

  const [currentCompany, setCurrentCompany] = useState(null)

  const [showForm, setShowForm] = useState(false);
  const [dataList, setDataList] = useState([]);

  const [newData, setNewData] = useState({
    items: [{ itemName: "", quantity: "", price: "", date: new Date().toISOString().split('T')[0] }],
    status: "pending",
    transportDetails: { name: "", driver: "", deliveryDate: new Date().toISOString().split('T')[0] }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {

    setDataList([
      {
        id: 1,
        items: [{ itemName: "sugar", quantity: "25", price: "50", date: "25/06/2025" }],
        status: "delivered",
        transportDetails: { name: "Khan", driver: "dfdf", deliveryDate: "25/06/2025" }
      }
    ])

    if (companies.length > 0) {
      const foundCompany = companies.find((company) => company.id == param.id);
      setCurrentCompany(foundCompany || null);
    }
  }, [param.id, companies, setDataList]);

  console.log(currentCompany?.companyName);


  const handleAddData = (e) => {
    e.preventDefault();

    if (!newData.items[0].itemName || !newData.items[0].quantity) {
      alert("Please fill in required fields!");
      return;
    }

    if (isEditing) {
      const updatedDataList = dataList.map((data) =>
        data.id === editId ? { ...newData, id: editId } : data
      );
      setDataList(updatedDataList);
      setIsEditing(false);
      setEditId(null);
    } else {
      const dataWithId = {
        ...newData,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0], // Automatically set the current date
      };
      setDataList([...dataList, dataWithId]);
    }

    resetForm();
    setShowForm(false);
  };


  const resetForm = () => {
    setNewData({
      items: [{ itemName: "", quantity: "", price: "", date: "" }],
      status: "pending",
      transportDetails: { name: "", driver: "", deliveryDate: "" }
    });
    setIsEditing(false);  // Reset editing state
    setEditId(null);      // Reset edit ID
  };

  const addNewItem = () => {
    setNewData(prev => ({
      ...prev,
      items: [...prev.items, { itemName: "", quantity: "", price: "", date: new Date().toISOString().split('T')[0] }]
    }));
  };


  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newData.items];
    updatedItems[index][field] = value;
    setNewData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleStatusChange = (status) => {
    setNewData(prev => ({
      ...prev,
      status,
      transportDetails: {
        ...prev.transportDetails,
        deliveryDate: status === 'delivered' ? new Date().toISOString().split('T')[0] : prev.transportDetails.deliveryDate
      }
    }));
  };


  const handleTransportChange = (field, value) => {
    setNewData(prev => ({
      ...prev,
      transportDetails: { ...prev.transportDetails, [field]: value }
    }));
  };

  const handleDelete = (id) => {
    setDataList(dataList.filter(item => item.id !== id));
  };

  const handleEdit = (id) => {
    const orderToEdit = dataList.find((order) => order.id === id);
    setNewData(orderToEdit);  // Prefill form with the selected order
    setIsEditing(true);
    setEditId(id);
    setShowForm(true);
  }

  return (
    <div className="flex h-auto">
      {/* Sidebar */}
      {isSidebarOpen ?
        <div className={`bg-gray-100 p-4 w-64`}>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-blue-500 text-sm mb-4"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="flex flex-col gap-2 text-lg">
            <h2 className="text-lg font-semibold">Company Details</h2>
            <h2>{currentCompany?.companyName}</h2>
            <h2> {currentCompany?.owner}</h2>
            <h2> {currentCompany?.contact}</h2>
            <h2> {currentCompany?.address}</h2>
          </div>

          <div className="flex overflow-y-auto flex-col mt-10 gap-3 text-blue-800 ">
            <h1 className="text-lg text-black font-semibold">Pages</h1>
            <Link href="/">
              <h1 className="hover:text-blue-500 hover:underline">Home</h1>
            </Link>
            <Link href="/pages/suppliers">
              <h1 className="hover:text-blue-500 hover:underline">Suppliers management</h1>
            </Link>
            <Link href="/pages/shops">
              <h1 className="hover:text-blue-600 hover:underline">Shopkeeper management</h1>
            </Link>
            <Link href="/pages/products">
              <h1 className="hover:text-blue-600 hover:underline">Inventory and stock</h1>
            </Link>
            <Link href="/pages/transactions">
              <h1 className="hover:text-blue-600 hover:underline">Transaction and Ledger</h1>
            </Link>
            <Link href="/pages/reports">
              <h1 className="hover:text-blue-600 hover:underline">Analytics and Reports</h1>
            </Link>
            <Link href="/pages/transports">
              <h1 className="hover:text-blue-600 hover:underline">Transportation</h1>
            </Link>
          </div>
        </div>
        :

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-blue-500 text-sm m-2 -mt-4 "
        >
          <Bars3Icon className="w-6 h-6 " />
        </button>

      }

      {/* Main Content */}
      <div className="flex-1 px-6 py-2">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        >
          Add New Order
        </button>

        {showForm && (
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
        )}

        {/* Data List */}
        <div className="space-y-4">
          {dataList.slice().reverse().map((data) => (
            <div key={data.id} className="bg-white p-4 rounded-lg shadow">
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
              <div className="grid grid-cols-4 gap-4 mb-4">
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

              {/* Transport Details */}
              {data.status === 'delivered' && (
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <TruckIcon className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium">Transport Details</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;