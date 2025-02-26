import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { ShopContext } from "../ContextApi/shopkeepersDataApi";

const AddShop = ({ setShowForm }) => {
  //   const navigate = useNavigate();
  // const [shops, setShops] = useState([]);
  const { shops, setShops } = useContext(ShopContext)
  const [ShopDetails, setShopsDetails] = useState({
    shopName: "",
    shopkeeperName: "",
    email:"",
    contact: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shopkeeper`,
        ShopDetails
      );
      setShops((prevShop) => [...prevShop, response.data]);
      setShowForm(false);
      setShopsDetails({
        shopName: "",
        shopkeeperName: "",
        email:"",
        contact: "",
        address: "",
      });
      console.log("Shop added successfully", shops);
    } catch (err) {
      console.error("Error adding shop:", err.message);
    }
  };

  const handleAddShop = (shop) => {
    setShops([...shops, shop]); // Update state
    setShowForm(false); // Close modal
  };
  //   const handleCompanyClick = (shop) => {
  //     navigate("/account", { state: { shop } });
  //   };

  //   const handleDelete = (id) => {
  //     const updatedShop = shop.filter((shop) => shop.id !== id);
  //     setShops(updatedShop);
  //     localStorage.setItem("shop", JSON.stringify(updatedShop));
  //   };

  return (
    <div className="p-6">

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">

        <div className="relative max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-semibold mb-4 text-center">Add New Shop</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Shop Name*</label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border rounded-md"
                value={ShopDetails.shopName}
                onChange={(e) => setShopsDetails({ ...ShopDetails, shopName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ShopKeeper Name*</label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border rounded-md"
                value={ShopDetails.shopkeeperName}
                onChange={(e) => setShopsDetails({ ...ShopDetails, shopkeeperName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full p-2 border rounded-md"
                value={ShopDetails.email}
                onChange={(e) => setShopsDetails({ ...ShopDetails, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                className="mt-1 block w-full p-2 border rounded-md"
                value={ShopDetails.contact}
                onChange={(e) => setShopsDetails({ ...ShopDetails, contact: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">shop Address</label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border rounded-md"
                value={ShopDetails.address}
                onChange={(e) => setShopsDetails({ ...ShopDetails, address: e.target.value })}
              />
            </div>

            <div className="flex justify-between mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">
                Cancel
              </button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Create shop
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddShop;