'use client'
import React, { useState, useContext, use, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import SideBar from "./components/SideBar";
import AddOrderForm from "./components/AddOrderForm";
import DataList from "./components/DataList";
import axios from "axios";

const Page = ({ params }) => {

  const param = use(params);

  const [isEditing, setIsEditing] = useState(false);

  const [editId, setEditId] = useState(null);

  const [currentSupplier, setCurrentSupplier] = useState(null)

  const [showForm, setShowForm] = useState(false);

  const [shipmentsData, setShipmentsData] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [loading, setLoading] = useState(false);

  const [newData, setNewData] = useState({
    date: new Date().toISOString().split('T')[0],
    items: [{
      itemName: "",
      quantity: 0,
      price: 0
    }],
    driver: {
      name: "",
      vehicle: ""
    },
    status: "Pending",
    partialPayment: 0,
    invoice: null,
    transactions: {
      paymentDate: new Date().toISOString().split('T')[0],
      partialPayment: 0,
      invoice: "",
      totalAmount: 0,
      totalDebit: 0,
      totalCredit: 0,
      payments: []
    }
  });


  useEffect(() => {

    const fetchSupplierData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${param.id}`);
        setCurrentSupplier(response.data);
        setShipmentsData(response.data.shipments);
        console.log(response.data);

      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(true);
      }
    }
    fetchSupplierData();


  }, [param.id]);

  console.log("shipmentsData", shipmentsData)
  console.log(loading)

  const handleDelete = (id) => {
    setShipmentsData(shipmentsData.filter(order => order._id !== id));
  };

  const handleEdit = (id) => {
    const orderToEdit = shipmentsData.find((order) => order._id === id);

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
        <SideBar setIsSidebarOpen={setIsSidebarOpen} currentSupplier={currentSupplier} />
        :
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-blue-500 text-sm top-8 left-3 fixed -mt-4 "
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
            shipmentsData={shipmentsData}
            setShipmentsData={setShipmentsData}
            id={param.id}
            newData={newData}
            setNewData={setNewData}
          />

        )}

        {/* Data List */}
        <div className="space-y-4">

          {loading && shipmentsData.slice().reverse().map((data, index) => (
            <DataList
              key={index}
              data={data}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              setNewData={setNewData}
            />
          ))}

        </div>

      </div>
    </div>
  );
};

export default Page;