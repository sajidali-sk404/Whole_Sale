'use client'
import React, { useState } from "react";
import axios from "axios";
import { FaTimes, FaBuilding, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const AddShopkeeper = ({ setShowForm, refreshShopkeepers }) => {

  const [formData, setFormData] = useState({
    shopName: "",
    shopkeeperName: "",
    contact: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState({}); // Add error state
  const [successMessage, setSuccessMessage] = useState(''); // Add success message


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(prevErrors => ({ ...prevErrors, [e.target.name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop Name is required';
    }
    if (!formData.shopkeeperName.trim()) {
      newErrors.shopkeeperName = 'shopkeeperName Name is required';
    }
    if (formData.contact && !/^[0-9]{10,15}$/.test(formData.contact)) { // Basic phone number validation
        newErrors.contact = 'Invalid phone number';
    }

     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shopkeeper`,
        formData
      );
      console.log("Shop added successfully", response.data);
      setSuccessMessage('Shopkeeper added successfully!'); // Set success message

      // Reset form and close modal
        setFormData({
            shopName: "",
            shopkeeperName: "",
            contact: "",
            email: "",
            address: "",
        });
      setShowForm(false);
        setErrors({}); // Clear errors
      refreshShopkeepers(); // Refresh Shopkeeper list in parent component
    } catch (err) {
        if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);

        // Set a generic error message, or use a specific one from the server if available
        setErrors({ api: err.response.data.message || 'An error occurred while adding the Shopkeeper.' });


      } else if (err.request) {
        // The request was made but no response was received
        console.log(err.request);
          setErrors({ api: 'No response received from the server. Please check your network connection.' });

      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', err.message);
           setErrors({ api: 'An unexpected error occurred.  Please try again.' });
      }
    }
  };

  const handleClose = () => {
    setFormData({
        shopName: "",
        shopkeeperName: "",
        contact: "",
        email: "",
        address: "",
    });
      setShowForm(false)
      setErrors({})
      setSuccessMessage('')

  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Shopkeeper</h2>
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
         {errors.api && <div className="text-red-500 mb-4">{errors.api}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
            <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
              Shop Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="shopName"
                id="shopName"
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.shopName ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.shopName}
                onChange={handleChange}

              />
            </div>
            {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>}
          </div>

          {/* shopkeeperName Name */}
          <div>
            <label htmlFor="shopkeeperName" className="block text-sm font-medium text-gray-700">
              Shopkeeper Name <span className="text-red-500">*</span>
            </label>
             <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
                <input
                type="text"
                name="shopkeeperName"
                id="shopkeeperName"
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.shopkeeperName ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.shopkeeperName}
                onChange={handleChange}

              />
             </div>
            {errors.shopkeeperName && <p className="text-red-500 text-xs mt-1">{errors.shopkeeperName}</p>}
          </div>

            {/* Contact Number */}
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
              Contact Number
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"  // Change to "tel" for better mobile keyboard
                name="contact"
                id="contact"
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.contact}
                onChange={handleChange}

              />
            </div>
             {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
          </div>

           {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
             <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
                <input
                type="email"
                name="email"
                id="email"
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.email}
                onChange={handleChange}

              />
             </div>
               {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Business Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Business Address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="address"
                id="address"
                className="block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
              Create Shop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShopkeeper;