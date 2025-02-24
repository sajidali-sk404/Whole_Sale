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

  const [dataList, setDataList] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [loading, setLoading] = useState(false);


  useEffect(() => {

    const fetchSupplierData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${param.id}`);
        setCurrentSupplier(response.data);
        setDataList((prev) => [...prev, response.data]);
        console.log(response.data)

      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(true);
      }
    }
    fetchSupplierData();


  }, [param.id]);

  console.log("datalist", dataList)
  console.log(loading)

  // const handleAddData = (e) => {
  //   e.preventDefault();

  //   if (!newData.items[0].itemName || !newData.items[0].quantity) {
  //     alert("Please fill in required fields!");
  //     return;
  //   }

  //   const totalAmount = newData.items.reduce((acc, item) => acc + Number((item.price * item.quantity) || 0), 0);
  //   const totalPaid = newData.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0;
  //   const newTotalPaid = totalPaid + Number(newData.partialPayment || 0);
  //   const remainingDebit = totalAmount - newTotalPaid;

  //   const updatedOrder = {
  //     ...newData,
  //     id: editId || Date.now(),
  //     date: new Date().toISOString(),
  //     debit: remainingDebit,
  //     credit: newTotalPaid,
  //     payments: [
  //       ...(newData.payments || []),
  //       {
  //         amount: Number(newData.partialPayment || 0),
  //         invoice: newData.invoice,
  //         date: new Date().toISOString(),
  //         debit: remainingDebit,
  //         credit: newTotalPaid
  //       },
  //     ],
  //   };

  //   if (isEditing) {
  //     setDataList((prev) => prev.map((order) => (order.id === editId ? updatedOrder : order)));
  //   } else {
  //     setDataList([...dataList, updatedOrder]);
  //   }

  //   resetForm();
  //   setShowForm(false);
  //   console.log(dataList)
  // };

  // const handleAddData = async (e) => {
  //   e.preventDefault();

  //   // Calculate total amount and payments
  //   const totalAmount = newData.items.reduce((acc, item) => acc + Number((item.price * item.quantity) || 0), 0);
  //   const totalPaid = newData.payments?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0;
  //   const newTotalPaid = totalPaid + Number(newData.partialPayment || 0);
  //   const remainingDebit = totalAmount - newTotalPaid;

  //   // Ensure transport details are properly structured
  //   const driverDetails = {
  //     name: newData.transportDetails.name || "Unknown",  // Ensure required field is not empty
  //     vehicle: newData.transportDetails.vehicle || "Unknown"  // Fix incorrect property
  //   };

  //   // Create the order object matching the backend schema
  //   const orderData = {
  //     shipments: [{
  //       date: new Date().toISOString(),
  //       items: newData.items,
  //       driver: driverDetails,  // Corrected driver details
  //       status: newData.status || "Pending",
  //     }],
  //     transactions: [
  //       {
  //         paymentDate: new Date().toISOString(),
  //         partialPayment: Number(newData.partialPayment || 0),
  //         invoice: newData.invoice || "N/A",  // Avoid sending undefined values
  //         totalAmount: totalAmount || 0,  // Ensure numeric values
  //         totalDebit: remainingDebit || 0,
  //         totalCredit: newTotalPaid || 0,
  //         payments: [
  //           {
  //             amount: Number(newData.partialPayment || 0),
  //             invoice: newData.invoice || "N/A",
  //             paymentDate: new Date().toISOString(),
  //             debit: remainingDebit || 0,
  //             credit: newTotalPaid || 0
  //           },
  //         ]
  //       }
  //     ]
  //   };

  //   try {
  //     // Send data to the backend API
  //     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${param.id}`, orderData);

  //     if (response.status === 201) {
  //       // Update local state with new data
  //       setDataList([...dataList, response.data]);
  //       alert("Order added successfully!");
  //       resetForm();
  //       setShowForm(false);
  //     } else {
  //       throw new Error("Failed to add order");
  //     }
  //   } catch (error) {
  //     console.error("Error adding order:", error);
  //     alert("Error adding order. Please try again.");
  //   }
  // };

  // const resetForm = () => {
  //   setNewData({
  //     items: [{ itemName: "", quantity: "", price: "", date: "" }],
  //     status: "Pending",
  //     transportDetails: { name: "", driver: "", deliveryDate: "" }
  //   });
  //   setIsEditing(false);  // Reset editing state
  //   setEditId(null);      // Reset edit ID
  // };

  // const addNewItem = () => {
  //   setNewData(prev => ({
  //     ...prev,
  //     items: [...prev.items, { itemName: "", quantity: "", price: "", date: new Date().toISOString().split('T')[0] }]
  //   }));
  // };


  // const handleItemChange = (index, field, value) => {
  //   const updatedItems = [...newData.items];
  //   updatedItems[index][field] = value;
  //   setNewData(prev => ({ ...prev, items: updatedItems }));
  // };

  // const handleStatusChange = (status) => {
  //   setNewData(prev => ({
  //     ...prev,
  //     status,
  //     transportDetails: {
  //       ...prev.transportDetails,
  //       deliveryDate: status === 'Delivered' ? new Date().toISOString().split('T')[0] : prev.transportDetails.deliveryDate
  //     }
  //   }));
  // };

  // const handleTransportChange = (field, value) => {
  //   setNewData(prev => ({
  //     ...prev,
  //     transportDetails: { ...prev.transportDetails, [field]: value }
  //   }));
  // };

  // const handleDelete = (id) => {
  //   setDataList(dataList.filter(item => item.id !== id));
  // };

  // const handleEdit = (id) => {
  //   const orderToEdit = dataList.find((order) => order.id === id);

  //   setNewData({
  //     ...orderToEdit,
  //     partialPayment: "", // Reset new payment input
  //     invoice: null, // Reset invoice input
  //   });

  //   setIsEditing(true);
  //   setEditId(id);
  //   setShowForm(true);
  // };

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
            currentSupplier={currentSupplier}
            setCurrentSupplier={setCurrentSupplier}
          // handleAddData={handleAddData}
          // newData={newData}
          // setNewData={setNewData}
          // handleItemChange={handleItemChange}
          // addNewItem={addNewItem}
          // handleStatusChange={handleStatusChange}
          // handleTransportChange={handleTransportChange}
          />

        )}

        {/* Data List */}
        <div className="space-y-4">

          {loading && currentSupplier.shipments.slice().reverse().map((data, index) => (
            <DataList
              key={index}
              data={data}
              // handleEdit={handleEdit}
              // handleDelete={handleDelete}
              // setNewData={setNewData}
               />
          ))}

        </div>

      </div>
    </div>
  );
};

export default Page;