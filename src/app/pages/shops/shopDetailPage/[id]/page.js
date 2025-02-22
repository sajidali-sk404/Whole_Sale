'use client'
import React, { useState, useContext, use, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

import { ShopContext } from '@/app/ContextApi/shopkeepersDataApi';
import SideBar from "./components/SideBar";
import AddOrderForm from "./components/AddOrderForm";
import DataList from "./components/DataList";

const Page = ({ params }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const param = use(params);

  const { shops } = useContext(ShopContext);

  const [currentShop, setCurrentShop] = useState(null)

  const [showForm, setShowForm] = useState(false);
  const [dataList, setDataList] = useState([]);

  const [newData, setNewData] = useState({
    items: [{ itemName: "", quantity: "", price: "", date: new Date().toISOString().split('T')[0] }],
    status: "pending",
    transportDetails: { name: "", driver: "", deliveryDate: "" },
    partialPayment: 0,
    invoice: null,
    debit: 0,
    credit: 0,
    payments: [],  // Ensure payments exists
    newPayment: { amount: "", invoice: null }, // Ensure newPayment exists
  });  


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {

    if (shops.length > 0) {
      const foundCompany = shops.find((shop) => shop.id == param.id);
      setCurrentShop(foundCompany || null);
    }
  }, [param.id, shops, setDataList]);

  const handleAddData = (e) => {
    e.preventDefault();

    if (!newData.items[0].itemName || !newData.items[0].quantity) {
      alert("Please fill in required fields!");
      return;
    }

    const totalAmount = newData.items.reduce((acc, item) => acc + Number((item.price*item.quantity) || 0), 0);
    const totalPaid = newData.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0;
    const newTotalPaid = totalPaid + Number(newData.partialPayment || 0);
    const remainingDebit = totalAmount - newTotalPaid;

    const updatedOrder = {
      ...newData,
      id: editId || Date.now(),
      date: new Date().toISOString(),
      debit: remainingDebit,
      credit: newTotalPaid,
      payments: [
        ...(newData.payments || []),
        {
          amount: Number(newData.partialPayment || 0),
          invoice: newData.invoice,
          date: new Date().toISOString(),
          debit: remainingDebit,
          credit: newTotalPaid
        },
      ],
    };

    if (isEditing) {
      setDataList((prev) => prev.map((order) => (order.id === editId ? updatedOrder : order)));
    } else {
      setDataList([...dataList, updatedOrder]);
    }

    resetForm();
    setShowForm(false);
  };



  const handleAddPayment = () => {
    if (!newData.newPayment?.amount || !newData.newPayment?.invoice) {
      alert("Please enter an amount and upload an invoice!");
      return;
    }

    setNewData((prev) => ({
      ...prev,
      payments: [...(prev.payments || []), { ...prev.newPayment, date: new Date().toISOString() }],
      newPayment: { amount: "", invoice: null } // Reset input fields
    }));
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

    setNewData({
      ...orderToEdit,
      partialPayment: "", // Reset new payment input
      invoice: null, // Reset invoice input
    });

    setIsEditing(true);
    setEditId(id);
    setShowForm(true);
  };



  return (
    <div className="flex h-auto">

      {/* Sidebar */}
      {isSidebarOpen ?
        <SideBar setIsSidebarOpen={setIsSidebarOpen} currentShop={currentShop} />
        :
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-blue-500 text-sm  top-8 left-3 fixed -mt-4 "
        >
          <Bars3Icon className="w-6 h-6 " />
        </button>

      }

      {/* Main Content */}
      <div className="flex-1 px-12 py-2">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
        >
          Add New Order
        </button>

        {showForm && (

          <AddOrderForm
            setShowForm={setShowForm}
            handleAddData={handleAddData}
            newData={newData}
            setNewData={setNewData}
            handleItemChange={handleItemChange}
            addNewItem={addNewItem}
            handleStatusChange={handleStatusChange}
            handleTransportChange={handleTransportChange}
            handleAddPayment={handleAddPayment} />

        )}

        {/* Data List */}
        <div className="space-y-4">

          {dataList.slice().reverse().map((data) => (
            <DataList
              key={data.id}
              data={data}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              setNewData={setNewData} />

          ))}

        </div>

      </div>
    </div>
  );
};

export default Page;