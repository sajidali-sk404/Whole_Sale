'use client'
import React, { useState, useCallback, useEffect, use } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaMoneyBillWave, FaChartLine } from 'react-icons/fa'; // Icons
import SideBar from "./components/SideBar";
import AddOrderForm from "./components/AddOrderForm";
import DataList from "./components/DataList";
import axios from "axios";
import DeliveryDeleteConfirmation from "./components/DeliveryDeleteConfirmation";

const Page = ({ params }) => {
  const param = use(params);
  const [currentShopkeeper, setCurrentShopkeeper] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deliveriesData, setDeliveriesData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteDeliveryId, setDeleteDeliveryId] = useState(null);

  const [newData, setNewData] = useState({
    date: new Date().toISOString().split('T')[0],
    items: [{ itemName: "", quantity: "", price: "" }],
    status: "Pending",
    payment: {
      paymentDate: new Date().toISOString().split('T')[0],
      totalAmount: "",
      givenAmount: "",
    }
  });

  const fetchShopkeeperData = useCallback(async () => {
    setError(null);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shopkeeper/${param.id}`);
      setCurrentShopkeeper(response.data);
      setDeliveriesData(response.data.orders);
    } catch (err) {
      setError(err.message || "An error occurred while fetching data.");
      console.error(err);
    }
  }, [param.id]);

  useEffect(() => {
    setLoading(true);
    try {
      fetchShopkeeperData();
    } catch (err) {
      setError(err.message || "An error occurred while fetching data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [param.id, fetchShopkeeperData]);

  const handleDeleteClick = (deliveryId) => {
    setDeleteDeliveryId(deliveryId);
    console.log(deliveryId)
    setShowDeleteConfirm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-auto">
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
        <SideBar setIsSidebarOpen={setIsSidebarOpen} currentShopkeeper={currentShopkeeper} />
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

        {/* Redesigned Summary Section */}
        <div className="mx-10 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center"><FaChartLine className="mr-2 text-blue-600" />Sub-Total</h2>
            <p className="text-xl font-bold text-gray-900">{currentShopkeeper?.subTotal}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center"><FaMoneyBillWave className="mr-2 text-blue-600" />Total Debit</h2>
            <p className="text-xl font-bold text-gray-900">{currentShopkeeper?.totalDebit}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center"><FaMoneyBillWave className="mr-2 text-blue-600" />Total Credit</h2>
            <p className="text-xl font-bold text-gray-900">{currentShopkeeper?.totalCredit}</p>
          </div>
        </div>

        {showForm && (
          <AddOrderForm
            setShowForm={setShowForm}
            deliveriesData={deliveriesData}
            setDeliveriesData={setDeliveriesData}
            id={param.id}
            newData={newData}
            setNewData={setNewData}
            currentShopkeeper={currentShopkeeper}
            fetchShopkeeperData={fetchShopkeeperData}
          />
        )}

        {/* Data List - Reverse the order here for display */}
        <div className="space-y-4">
          {deliveriesData
            .slice()
            .reverse()
            .filter(data => data && data._id) 
            .map((data) => (
              <DataList
                key={data._id} 
                data={data}
                handleDelete={handleDeleteClick}
              />
            ))}
        </div>

        {showDeleteConfirm && (
          <DeliveryDeleteConfirmation
            deliveryId={deleteDeliveryId}
            shopkeeperId={param.id} // Pass the shopkeeper ID!
            setShowDeleteConfirm={setShowDeleteConfirm}
            setDeliveriesData={setDeliveriesData}
            setError={setError}     // Pass setError
            fetchShopkeeperData={fetchShopkeeperData}
          />
        )}

      </div>
    </div>
  );
};

export default Page;