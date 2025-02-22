import React, { useState, useEffect } from "react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

const AddCompany = ({ setShowForm, setCompanies, companies }) => {
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    owner: "",
    contact: "",
    email: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/supplier`,
        companyDetails
      );
      setCompanies((prevCompanies) => [...prevCompanies, response.data]);
      setShowForm(false);
      setCompanyDetails({
        companyName: "",
        owner: "",
        contact: "",
        address: "",
      });
      console.log("Company added successfully");
    } catch (err) {
      console.error("Error adding company:", err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="relative max-w-3xl w-full bg-white shadow-lg rounded-lg p-6 ">
          <button
            onClick={() => setShowForm(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-semibold mb-4 text-center">
            Add Supplier Company
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name*
              </label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border rounded-md"
                value={companyDetails.companyName}
                onChange={(e) =>
                  setCompanyDetails({
                    ...companyDetails,
                    companyName: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Owner Name*
              </label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border rounded-md"
                value={companyDetails.owner}
                onChange={(e) =>
                  setCompanyDetails({
                    ...companyDetails,
                    owner: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border rounded-md"
                value={companyDetails.contact}
                onChange={(e) =>
                  setCompanyDetails({
                    ...companyDetails,
                    contact: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email*
              </label>
              <input
                type="email"
                className="mt-1 block w-full p-2 border rounded-md"
                value={companyDetails.email}
                onChange={(e) =>
                  setCompanyDetails({
                    ...companyDetails,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Address
              </label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border rounded-md"
                value={companyDetails.address}
                onChange={(e) =>
                  setCompanyDetails({
                    ...companyDetails,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Create Company
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCompany;
