// Page.js
'use client'
import React, { useState, useContext, useEffect, use } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import SideBar from "./components/SideBar";
import AddOrderForm from "./components/AddOrderForm";
import DataList from "./components/DataList";
import EditOrderForm from "./components/EditOrderForm";
import EditStatusForm from "./components/EditStatusForm";
import EditItemStatusForm from "./components/EditItemStatusForm";
import axios from "axios";
import ShipmentDeleteConfirmation from "./components/ShipmentDeleteConfirmation";

const Page = ({ params }) => {
  const param = use(params);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [showItemStatusForm, setShowItemStatusForm] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [shipmentDataToEdit, setShipmentDataToEdit] = useState(null);
  const [shipmentsData, setShipmentsData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [error, setError] = useState(null); // Add error state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteShipmentId, setDeleteShipmentId] = useState(null);

  const [newData, setNewData] = useState({ //Keep this, as Add form use this
    date: new Date().toISOString().split('T')[0],
    items: [{ itemName: "", quantity: 0, price: 0, status: "Pending", }],
    driver: { name: "", vehicle: "" },
    status: "Pending",
    transactions: {
      paymentDate: new Date().toISOString().split('T')[0],
      partialPayment: 0,
      invoice: null,
      totalAmount: 0,
      totalDebit: 0,
      totalCredit: 0,
      payments: []
    }
  });

  useEffect(() => {
    const fetchSupplierData = async () => {
      setLoading(true); // Start loading
      setError(null);    // Clear previous errors
      try {
        const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/supplier/${param.id}`, { // Protected route
          headers: {
              'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
              'Content-Type': 'application/json', // Or any content type your API expects
          },
      });
        setCurrentSupplier(response.data);
        setShipmentsData(response.data.shipments);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data."); // Set error message
        console.error(err);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchSupplierData();
  }, [param.id]);

  const handleDeleteClick = (shipmentId) => {
    setDeleteShipmentId(shipmentId);
    setShowDeleteConfirm(true);
  };

  const handleEditShipment = (shipment) => {
    setShipmentDataToEdit(shipment);
    setShowEditForm(true);
    setShowForm(false);
  };

  const handleStatusEdit = (shipment) => {
    setShipmentDataToEdit(shipment);
    setShowStatusForm(true);
  };

  const handleItemStatusEdit = (shipment) => {
    setShipmentDataToEdit(shipment);
    setShowItemStatusForm(true);
  };

  // Centralized loading and error display
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {isSidebarOpen ? (
        <SideBar setIsSidebarOpen={setIsSidebarOpen} currentSupplier={currentSupplier} />
      ) : (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 mx-10 text-white px-4 py-2 rounded-md mb-4 transition-colors duration-200"
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

        {showEditForm && shipmentDataToEdit && (
          <EditOrderForm
            setShowEditForm={setShowEditForm}
            setShipmentsData={setShipmentsData}
            id={param.id}
            shipmentData={shipmentDataToEdit}
            setShowForm={setShowForm}
          />
        )}

        {showItemStatusForm && (
          <EditItemStatusForm
            setShowItemStatusForm={setShowItemStatusForm}
            setShipmentsData={setShipmentsData}
            id={param.id}
            shipmentData={shipmentDataToEdit}
          />
        )}

        {showStatusForm && (
          <EditStatusForm
            setShowStatusForm={setShowStatusForm}
            setShipmentsData={setShipmentsData}
            id={param.id}
            shipmentData={shipmentDataToEdit}
          />
        )}

        {/* Data List - Reverse the order here for display */}
        <div className="space-y-4">
          {shipmentsData.slice().reverse().map((data) => (
            <DataList
              key={data._id}
              data={data}
              handleEdit={handleEditShipment}
              handleDelete={handleDeleteClick}
              handleStatusEdit={handleStatusEdit}
              handleItemStatusEdit={handleItemStatusEdit}
            />
          ))}
        </div>

        {showDeleteConfirm && (
          <ShipmentDeleteConfirmation
            shipmentId={deleteShipmentId}
            supplierId={param.id} // Pass the supplier ID!
            setShowDeleteConfirm={setShowDeleteConfirm}
            setShipmentsData={setShipmentsData}
            setLoading={setLoading} // Pass setLoading
            setError={setError}     // Pass setError
          />
        )}

      </div>
    </div>
  );
};

export default Page;