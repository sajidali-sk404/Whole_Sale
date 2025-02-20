import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Addshop = ({setShowForm, setshop, shop }) => {
//   const navigate = useNavigate();
  // const [shop, setshop] = useState([]);

  const [ShopDetails, setShopDetails] = useState({
    ShopName: "",
    ShopKeeperName: "",
    contact: "",
    address: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ShopDetails.ShopName || !ShopDetails.ShopKeeperName) {
      alert("Please fill in required shop details!");
      return;
    }

    const newShop = {
      id: Date.now(),
      ...ShopDetails,
    };

    const updatedShop = [...shop, newShop];
    setshop(updatedShop);

    setShopDetails({ ShopName: "", ShopKeeperName: "", contact: "", address: "" });
    setShowForm(false);
  };

  const handleAddShop = (shop) => {
    setshop([...shop, shop]); // Update state
    setShowAddShop(false); // Close modal
  };
//   const handleCompanyClick = (shop) => {
//     navigate("/account", { state: { shop } });
//   };

//   const handleDelete = (id) => {
//     const updatedShop = shop.filter((shop) => shop.id !== id);
//     setshop(updatedShop);
//     localStorage.setItem("shop", JSON.stringify(updatedShop));
//   };

  return (
    <div className="p-6">
        
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
           
          <div className="relative max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">Add shop</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Shop Name*</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border rounded-md"
                  value={ShopDetails.ShopName}
                  onChange={(e) => setShopDetails({ ...ShopDetails, ShopName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ShopKeeper Name*</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border rounded-md"
                  value={ShopDetails.ShopKeeperName}
                  onChange={(e) => setShopDetails({ ...ShopDetails, ShopKeeperName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  className="mt-1 block w-full p-2 border rounded-md"
                  value={ShopDetails.contact}
                  onChange={(e) => setShopDetails({ ...ShopDetails, contact: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">shop Address</label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border rounded-md"
                  value={ShopDetails.address}
                  onChange={(e) => setShopDetails({ ...ShopDetails, address: e.target.value })}
                />
              </div>

              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => {handleAddShop(); setShowForm(false);}} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">
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

export default Addshop;