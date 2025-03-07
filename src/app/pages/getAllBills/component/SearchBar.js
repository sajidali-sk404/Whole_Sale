import React, { useState } from 'react';
import axios from 'axios';

function BillSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setSearchResults([]);

    try {
      const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
      const params = { searchTerm }; // Send the search term as a single parameter
      console.log(params);

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bills/search`, { params }, { // Protected route
        headers: {
            'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
            'Content-Type': 'application/json', // Or any content type your API expects
        },
    });

      setSearchResults(response.data);
    } catch (err) {
      console.error('Search error:', err);
      if (err.response && err.response.status === 404) {
        setError('No bills found matching the search criteria.');
      } else {
        setError('An error occurred during the search.');
      }
    } finally {
      setLoading(false);
    }
  };
  console.log(searchResults);
  console.log(searchTerm); 
  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md ">

      <div className="mb-4">
        <label htmlFor="searchTerm" className="block text-gray-700 text-sm font-bold mb-2">
          Search (Invoice Number or Customer Name):
        </label>
        <input
          type="text"
          id="searchTerm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter invoice number or customer name"
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          loading ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && (
        <div className="text-red-500 mt-3">{error}</div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Search Results:</h3>
          <ul className="divide-y divide-gray-200">
            {searchResults.map((bill) => (
              <li key={bill._id} className="py-4">
                <p>
                  <strong className="font-medium text-gray-700">Invoice Number:</strong> {bill.invoiceNumber}
                </p>
                <p>
                  <strong className="font-medium text-gray-700">Customer Name:</strong> {bill.customerName}
                </p>
                <p>
                  <strong className="font-medium text-gray-700">Shopkeeper:</strong> {bill.shopkeeper ? bill.shopkeeper.name : 'N/A'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BillSearch;