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

const Page = ({ params }) => {
    const param = use(params);
    const [currentShopkeeper, setCurrentShopkeeper] = useState(null);
    const [showItemStatusForm, setShowItemStatusForm] = useState(false);
    const [showStatusForm, setShowStatusForm] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [deliveryDataToEdit, setDeliveryDataToEdit] = useState(null);
    const [deliveriesData, setDeliveriesData] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newData, setNewData] = useState({
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
        const fetchShopkeeperData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shopkeeper/${param.id}`);
                setCurrentShopkeeper(response.data);
                setDeliveriesData(response.data.deliveries);
            } catch (err) {
                setError(err.message || "An error occurred while fetching data."); // Set error message
                console.error(err);
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchShopkeeperData();
    }, [param.id]);

    const handleDeleteDelivery = async (id) => {
      setLoading(true);
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/shopkeeper/${param.id}/delivery/${id}`);
            setDeliveriesData(prevDeliveries => prevDeliveries.filter(order => order._id !== id));
        } catch (error) {
            console.error("Error deleting delivery:", error);
            setError("Failed to delete delivery. Please try again.");
        } finally {
          setLoading(false);
        }
    };

    const handleEditDelivery = (delivery) => {
        setDeliveryDataToEdit(delivery);
        setShowEditForm(true);
        setShowForm(false);
    };

    const handleStatusEdit = (delivery) => {
        setDeliveryDataToEdit(delivery);
        setShowStatusForm(true);
    };

    const handleItemStatusEdit = (delivery) => {
        setDeliveryDataToEdit(delivery);
        setShowItemStatusForm(true);
    };

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

              {showForm && (
                <AddOrderForm
                  setShowForm={setShowForm}
                  deliveriesData={deliveriesData}
                  setDeliveriesData={setDeliveriesData}
                  id={param.id}
                  newData={newData}
                  setNewData={setNewData}
                />
              )}

              {showEditForm && deliveryDataToEdit && (
                <EditOrderForm
                  setShowEditForm={setShowEditForm}
                  setDeliveriesData={setDeliveriesData}
                  id={param.id}
                  deliveryData={deliveryDataToEdit}
                  setShowForm={setShowForm}
                />
              )}

                {showItemStatusForm && (
                    <EditItemStatusForm
                        setShowItemStatusForm={setShowItemStatusForm}
                        setDeliveriesData={setDeliveriesData}
                        id={param.id}
                        deliveryData={deliveryDataToEdit}
                    />
                )}

                {showStatusForm && (
                    <EditStatusForm
                        setShowStatusForm={setShowStatusForm}
                        setDeliveriesData={setDeliveriesData}
                        id={param.id}
                        deliveryData={deliveryDataToEdit}
                    />
                )}

                {/* Data List - Reverse the order here for display */}
                <div className="space-y-4">
                    {deliveriesData.slice().reverse().map((data) => (
                        <DataList
                            key={data._id}
                            data={data}
                            handleEdit={handleEditDelivery}
                            handleDelete={handleDeleteDelivery}
                            handleStatusEdit={handleStatusEdit}
                            handleItemStatusEdit={handleItemStatusEdit}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;