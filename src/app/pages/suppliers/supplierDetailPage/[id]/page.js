'use client'
import React, { useState, useContext, use, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

import { CompanyContext } from '@/app/ContextApi/companiesDataApi';
import SideBar from "./components/SideBar";
import AddOrderForm from "./components/AddOrderForm";
import DataList from "./components/DataList";

const Page = ({ params }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const param = use(params);

  const { companies, setCompanies } = useContext(CompanyContext);

  const [currentCompany, setCurrentCompany] = useState(null)

  const [showForm, setShowForm] = useState(false);
  const [dataList, setDataList] = useState([]);

  const [newData, setNewData] = useState({
    items: [{ itemName: "", quantity: "", price: "", date: new Date().toISOString().split('T')[0] }], // Auto-set date
    status: "pending",
    transportDetails: { name: "", driver: "", deliveryDate: "" },
    partialPayment: 0,
    invoice: null,
    debit: 0,
    credit: 0,
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

    const totalAmount = newData.items.reduce((acc, item) => acc + Number(item.price || 0), 0);
    const remainingDebit = totalAmount - newData.partialPayment;

    const dataWithId = {
      ...newData,
      id: Date.now(),
      date: new Date().toISOString(),
      debit: remainingDebit,
      credit: newData.partialPayment,
    };

    setDataList([...dataList, dataWithId]);
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
        <SideBar setIsSidebarOpen={setIsSidebarOpen} currentCompany={currentCompany} />
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

          <AddOrderForm
            setShowForm={setShowForm}
            handleAddData={handleAddData}
            newData={newData}
            setNewData={setNewData}
            handleItemChange={handleItemChange}
            addNewItem={addNewItem}
            handleStatusChange={handleStatusChange}
            handleTransportChange={handleTransportChange} />

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