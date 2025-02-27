'use client'
import { useState } from "react";
import { FaTruck, FaUser, FaCalendarAlt, FaMoneyBillWave, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'; // Import icons

export default function TransportationManagement() {
  const [transportRecords, setTransportRecords] = useState([
    {
      id: 1,
      companyName: "ABC Suppliers",
      truckId: "TRK-001",
      driverName: "Ali Khan",
      rent: 5000,
      date: "2025-02-10",
      status: "Transported",
    },
    {
      id: 2,
      companyName: "XYZ Traders",
      truckId: "TRK-002",
      driverName: "Raza Ahmed",
      rent: 7000,
      date: "2025-02-12",
      status: "Pending",
    },
  ]);

  const [newRecord, setNewRecord] = useState({
    companyName: "",
    truckId: "",
    driverName: "",
    rent: "",
    date: "",
    status: "Pending",
  });

    const [isFormVisible, setIsFormVisible] = useState(false); // Control form visibility

  const handleChange = (e) => {
    setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { ...newRecord, id: transportRecords.length + 1 };
    setTransportRecords([...transportRecords, newEntry]);
    setNewRecord({
      companyName: "",
      truckId: "",
      driverName: "",
      rent: "",
      date: "",
      status: "Pending",
    });
    setIsFormVisible(false); // Hide form after submit
  };

    const toggleForm = () => {
        setIsFormVisible(!isFormVisible);
    };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Transportation Management</h1>
        <p className="text-gray-600 mb-8">Track and manage your transportation records.</p>


        {/* Transportation Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
           <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Truck ID</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transportRecords.length > 0 ? (
                transportRecords.map((record) => (
                <tr key={record.id} className="hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.companyName}</div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{record.truckId}</div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{record.driverName}</div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Rs. {record.rent}</div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{record.date}</div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === "Transported"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                    <td colSpan="6" className="py-4 px-6 text-center text-gray-500"> No records Found</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>


        {/* Toggleable Form */}
            <button
                onClick={toggleForm}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
            >
                <FaTruck className="mr-2" />
                {isFormVisible ? 'Hide Form' : 'Add New Transportation Record'}
            </button>


      {isFormVisible && (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Add New Transportation</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  placeholder="Company Name"
                  value={newRecord.companyName}
                  onChange={handleChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Truck ID */}
            <div>
              <label htmlFor="truckId" className="block text-sm font-medium text-gray-700">Truck ID</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTruck className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="truckId"
                  id="truckId"
                  placeholder="Truck ID"
                  value={newRecord.truckId}
                  onChange={handleChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

             {/* Driver Name */}
            <div>
              <label htmlFor="driverName" className="block text-sm font-medium text-gray-700">Driver Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" /> {/* Driver Icon */}
                </div>
                <input
                  type="text"
                  name="driverName"
                  id="driverName"
                  placeholder="Driver Name"
                  value={newRecord.driverName}
                  onChange={handleChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Rent */}
            <div>
              <label htmlFor="rent" className="block text-sm font-medium text-gray-700">Rent (Rs.)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMoneyBillWave className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="rent"
                  id="rent"
                  placeholder="Rent (Rs.)"
                  value={newRecord.rent}
                  onChange={handleChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Date */}
             <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={newRecord.date}
                  onChange={handleChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <select
                  name="status"
                  id="status"
                  value={newRecord.status}
                  onChange={handleChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="Pending">Pending</option>
                  <option value="Transported">Transported</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
              Add Transportation
            </button>
          </form>
        </div>
      )}
      </div>
    </div>
  );
}