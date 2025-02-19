'use client'
import { useState } from "react";

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
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Transportation Management</h1>

      {/* Transportation Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Company</th>
              <th className="py-2 px-4 border">Truck ID</th>
              <th className="py-2 px-4 border">Driver</th>
              <th className="py-2 px-4 border">Rent</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {transportRecords.map((record) => (
              <tr key={record.id} className="text-center">
                <td className="py-2 px-4 border">{record.companyName}</td>
                <td className="py-2 px-4 border">{record.truckId}</td>
                <td className="py-2 px-4 border">{record.driverName}</td>
                <td className="py-2 px-4 border">Rs. {record.rent}</td>
                <td className="py-2 px-4 border">{record.date}</td>
                <td
                  className={`py-2 px-4 border ${
                    record.status === "Transported"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {record.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Transportation Record Form */}
      <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">Add New Transportation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={newRecord.companyName}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
          <input
            type="text"
            name="truckId"
            placeholder="Truck ID"
            value={newRecord.truckId}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
          <input
            type="text"
            name="driverName"
            placeholder="Driver Name"
            value={newRecord.driverName}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
          <input
            type="number"
            name="rent"
            placeholder="Rent (Rs.)"
            value={newRecord.rent}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
          <input
            type="date"
            name="date"
            value={newRecord.date}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
          <select
            name="status"
            value={newRecord.status}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="Transported">Transported</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
          >
            Add Transportation
          </button>
        </form>
      </div>
    </div>
  );
}
