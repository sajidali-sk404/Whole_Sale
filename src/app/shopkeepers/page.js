'use client'
import React,{useState} from 'react'

function ShopKeeperManagment() {
  const [shopkeepers, setShopkeepers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', shopName: 'John\'s Grocery' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', shopName: 'Jane\'s Bakery' },
  ]);

  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    shopName: '',
  });

  // State to track if the form is in edit mode
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      // Update existing shopkeeper
      const updatedShopkeepers = shopkeepers.map((shopkeeper) =>
        shopkeeper.id === editId ? { ...shopkeeper, ...formData } : shopkeeper
      );
      setShopkeepers(updatedShopkeepers);
      setEditMode(false);
      setEditId(null);
    } else {
      // Add new shopkeeper
      const newShopkeeper = { ...formData, id: Date.now() };
      setShopkeepers([...shopkeepers, newShopkeeper]);
    }

    // Clear form
    setFormData({ name: '', email: '', phone: '', shopName: '' });
  };

  // Handle edit button click
  const handleEdit = (shopkeeper) => {
    setFormData(shopkeeper);
    setEditMode(true);
    setEditId(shopkeeper.id);
  };

  // Handle delete button click
  const handleDelete = (id) => {
    const updatedShopkeepers = shopkeepers.filter((shopkeeper) => shopkeeper.id !== id);
    setShopkeepers(updatedShopkeepers);
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopkeeper Management</h1>

      {/* Add/Edit Shopkeeper Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Shopkeeper' : 'Add New Shopkeeper'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="p-2 border rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="p-2 border rounded-md"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="p-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="shopName"
              placeholder="Shop Name"
              value={formData.shopName}
              onChange={handleInputChange}
              className="p-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            {editMode ? 'Update Shopkeeper' : 'Add Shopkeeper'}
          </button>
        </form>
      </div>

      {/* Shopkeepers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shop Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shopkeepers.map((shopkeeper) => (
              <tr key={shopkeeper.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shopkeeper.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shopkeeper.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shopkeeper.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shopkeeper.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shopkeeper.shopName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEdit(shopkeeper)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(shopkeeper.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ShopKeeperManagment;