'use client';
import React, { useState, useRef, useEffect, useContext } from "react";
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp, MdPrint, MdAddShoppingCart, MdReceipt } from "react-icons/md";
import { FaUser, FaAddressCard, FaCalendarAlt, FaMoneyBillWave, FaTags, FaHandHoldingUsd } from 'react-icons/fa';
import { InventoryContext } from "@/app/ContextApi/inventoryDataApi";
import { ShopContext } from "@/app/ContextApi/shopkeepersDataApi";


const CustomerBilling = () => {
    const [bills, setBills] = useState([]);
    const [invoiceNo, setInvoiceNo] = useState(1);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [customerName, setCustomerName] = useState("");
    const [address, setAddress] = useState("");
    const [cart, setCart] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
    const [oldBalance, setOldBalance] = useState(0);
    const [customerGivenAmount, setCustomerGivenAmount] = useState(0);
    const [debt, setDebt] = useState(0);
    const [showDetails, setShowDetails] = useState({});
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [errors, setErrors] = useState({});
    const printRef = useRef();
    const [filteredShops, setFilteredShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);



    const { inventoryData, setInventoryData } = useContext(InventoryContext); // Access setInventoryData
    const { shops, setShops } = useContext(ShopContext);
    const watermarkImageUrl = '/watermark_p.PNG';

    useEffect(() => {
        if (customerName) {
            const filtered = shops.filter(shop =>
                shop.shopkeeperName.toLowerCase().includes(customerName.toLowerCase())
            );
            setFilteredShops(filtered);
        } else {
            setFilteredShops([]);
            setSelectedShop(null);
        }
    }, [customerName, shops]);

    useEffect(() => {
        if (selectedShop) {
            setOldBalance(selectedShop.totalDebit || 0);
            setAddress(selectedShop.address || "")
        } else {
            setOldBalance(0);
        }
    }, [selectedShop]);


    const validateForm = () => {
        const newErrors = {};

        if (!customerName.trim()) {
            newErrors.customerName = 'Customer Name is required';
        }
        if (cart.length === 0) {
            newErrors.cart = 'Add at least one item to the cart.';
        }
        if (newItem.name && (!newItem.quantity || !newItem.price)) {
            newErrors.newItem = "Quantity and price are needed"
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateItemForm = () => {
        const itemErrors = {};

        if (newItem.name && (!newItem.quantity || !newItem.price)) {
            itemErrors.newItem = "Quantity and price are required for new items.";
        }
        setErrors(itemErrors)
        return Object.keys(itemErrors).length === 0;
    }

    useEffect(() => {
        if (bills.length > 0) {
            setInvoiceNo(bills[bills.length - 1].invoiceNo + 1);
        }
    }, [bills]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'customerName') {
            setCustomerName(value);
            setSelectedShop(null);
        }
        else if (name === 'address') {
            setAddress(value)
        }
        else if (name === 'date') {
            setDate(value)
        }
        else if (name === 'oldBalance') {
            if (value === '' || /^[0-9]*$/.test(value)) {
                setOldBalance(value === '' ? '' : parseFloat(value));
            }
        }
        else if (name === 'customerGivenAmount') {
            if (value === '' || /^[0-9]*$/.test(value)) {
                setCustomerGivenAmount(value === '' ? '' : parseFloat(value))
            }
        }
        else if (name === 'discountPercentage') {
            if (value === '' || /^[0-9]*$/.test(value)) {
                setDiscountPercentage(value === '' ? '' : parseFloat(value))
            }
        }
        //For adding a new Item.
        else if (name === "newItemName") {
            setNewItem({ ...newItem, name: value })
        }
        else if (name === "newItemQuantity") {
            if (/^[0-9]*$/.test(value)) {
                setNewItem({ ...newItem, quantity: value });
            }
        }
        else if (name === "newItemPrice") {
            if (/^[0-9]*$/.test(value)) {
                setNewItem({ ...newItem, price: value });
            }
        }

        setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    };

    const handleAddToCart = () => {
        if (!validateItemForm()) {
            return;
        }
        if (newItem.name && newItem.quantity && newItem.price) {
            setCart([...cart, { ...newItem, itemName: newItem.name, total: newItem.quantity * newItem.price }]);
            setNewItem({ name: "", quantity: "", price: "" });
            setErrors({})
        }
    };

    const handleGenerateBill = () => {
        if (!validateForm()) {
            return;
        }

        if (customerName && cart.length > 0) {
            const totalAmount = cart.reduce((acc, item) => acc + parseFloat(item.total), 0);
            const discountAmount = (discountPercentage / 100) * totalAmount;
            const totalAfterDiscount = totalAmount - discountAmount;
            const netAmount = totalAfterDiscount + parseFloat(oldBalance || 0);
            const calculatedDebt = netAmount - parseFloat(customerGivenAmount || 0);

            setDebt(calculatedDebt);

            const newBill = {
                invoiceNo,
                date,
                customerName,
                address,
                cart,
                totalAmount,
                discountPercentage,
                discountAmount,
                totalAfterDiscount,
                oldBalance: parseFloat(oldBalance || 0),
                netAmount,
                customerGivenAmount: parseFloat(customerGivenAmount || 0),
                debt: calculatedDebt
            };


            // Update Inventory
            const updatedInventory = inventoryData.map(item => {
                const cartItem = cart.find(cartItem => cartItem.itemName === item.itemName);
                if (cartItem) {
                    return { ...item, quantity: item.quantity - parseInt(cartItem.quantity) }; //Subtracted quantity should be parsed to int.
                }
                return item;
            });

            setInventoryData(updatedInventory);
            setBills([...bills, newBill]);
            setShowDetails({ ...showDetails, [invoiceNo]: false });
            setCustomerName("");
            setAddress("");
            setCart([]);
            setDiscountPercentage(0);
            setOldBalance(0);
            setCustomerGivenAmount(0);
            setInvoiceNo(invoiceNo + 1);
            setDate(new Date().toISOString().split('T')[0]);
            setErrors({});
            setSelectedShop(null);
        }
    };

    const handleRemoveItem = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const handlePrint = (bill) => {
        const printContent = `
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sale Invoice</title>
          <style>
           body {
             font-family: Arial, sans-serif;
             margin: 0;
             padding: 0;
             box-sizing: border-box;

           }
            .invoice-container {
                width: 95%;
                max-width: 800px;
                margin: 20px auto;
                background: white;
                border: 1px solid #ddd;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                position: relative; /* Needed for absolute positioning */
                overflow: hidden; /* Clip content if it overflows the container */
             }

             .watermark {
                position: absolute;
                top: 60%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 85%; 
                height: auto;
                opacity: 0.2; 
                z-index: 0; 
            }

              .header {
                  text-align: center;
                  margin-bottom: 10px;
                  position:relative;
              }
              .header h1 {
                  margin: 0;
                  color: #333;
              }
              .header p {
                  color: #666;
                  margin: 5px 0;
              }
              .details {
                  width: 100%;
                  margin-bottom: 20px;
                  table-layout: fixed;
                  position:relative;

              }
              .details td {
                  padding: 5px;
              }
              .details strong {
                  color: #333;
              }
              .table-container {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
                  position:relative;

              }
              .table-container th, .table-container td {
                  border: 1px solid #ddd;
                  padding: 8px;
                  text-align: center;
                  word-wrap: break-word;
              }
              .table-container th {
                  background-color: #f2f2f2;
              }
              .summary-table {
                  width: 100%;
                  margin-left: auto;
                  border-collapse: collapse;
                  position:relative;

              }
              .summary-table td {
                  padding: 5px;
                  text-align: right;
                  border-bottom: 1px solid #eee;
              }
              .summary-table tr:last-child td {
                  border-bottom: none;
              }
              .summary-table strong {
                  color: #333;
              }
              .footer {
                  margin-top: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #666;
                  border-top: 1px solid #ddd;
                  padding-top: 10px;
                  position:relative;
                  z-index: 1;

              }
              .signature {
                  text-align: left;
                  margin-top: 30px;
                  color: #333;
                  position:relative;

              }
              @media (max-width: 768px) {
                  .invoice-container {
                      width: 95%;
                      padding: 10px;
                  }
                  .table-container th, .table-container td {
                      padding: 5px;
                      font-size: 12px;
                  }
                  .summary-table td {
                      padding: 5px;
                      font-size: 12px;
                  }
                  .header h1 {
                      font-size: 20px;
                  }
                  .header p {
                      font-size: 12px;
                  }

    
              }
          </style>
      </head>
      <body>
        <div class="invoice-container">
            <img src="${watermarkImageUrl}" alt="Watermark" class="watermark">
                <div class="header">
                    <h1>M.Amir Traders</h1>
                    <p>Whole Sale Distributor Sugar, Ghee, Wheat etc</p>
                    <p>Watkay Chowk Shadara Mingora Swat</p>
                    <p>Ph#: 0341-6120696, 0946-818811</p>
                </div>

                <table class="details">
                    <tr>
                        <td><strong>Code:</strong> 1200</td>
                        <td><strong>Invoice No:</strong> ${bill.invoiceNo}</td>
                    </tr>
                    <tr>
                        <td><strong>Name:</strong> ${bill.customerName}</td>
                        <td><strong>Date:</strong> ${bill.date}</td>
                    </tr>
                    <tr>
                        <td><strong>Address:</strong> ${bill.address}</td>
                        <td><strong>Mob#:</strong> </td>
                    </tr>
                    <tr>
                        <td><strong>Ref. Name:</strong> SWAT</td>
                        <td><strong>CNIC#:</strong> </td>
                    </tr>
                </table>

                <table class="table-container">
                    <thead>
                        <tr>
                            <th>Qty</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Net Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bill.cart.map((item, index) => `
                            <tr key=${index}>
                                <td>${item.quantity}</td>
                                <td>${item.itemName}</td>
                                <td>${item.price} PKR</td>
                                <td>${item.total} PKR</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <table class="summary-table">
                    <tr>
                        <td><strong>Total Amount</strong></td>
                        <td>${bill.totalAmount.toFixed(2)} PKR</td>
                    </tr>
                    <tr>
                        <td><strong>Discount:</strong></td>
                        <td>${bill.discountAmount.toFixed(2)} PKR</td>
                    </tr>
                    <tr>
                        <td><strong>Total After Discount:</strong></td>
                        <td>${bill.totalAfterDiscount.toFixed(2)} PKR</td>
                    </tr>
                    <tr>
                        <td><strong>Old Balance:</strong></td>
                        <td>${bill.oldBalance.toFixed(2)} PKR</td>
                    </tr>
                    <tr>
                        <td><strong>Net Bill Amount:</strong></td>
                        <td>${bill.netAmount.toFixed(2)} PKR</td>
                    </tr>
                    <tr>
                        <td><strong>Given Amount</strong></td>
                        <td>${bill.customerGivenAmount.toFixed(2)} PKR</td>
                    </tr>
                    <tr>
                        <td><strong>Remaining Amount</strong></td>
                        <td>${bill.debt.toFixed(2)} PKR</td>
                    </tr>
                </table>

                <div class="signature">
                    <p><strong>Generated By:</strong> Store Manager</p>
                </div>

                <div class="footer">
                    <p>Note: This is a computer-generated invoice and does not require a signature.</p>
                </div>
            </div>
        </body>
        </html>
    `;

        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        } else {
            alert('Failed to open print window. Please check your browser settings.');
        }
    };

    const toggleDetails = (invoiceNo) => {
        setShowDetails(prevState => ({
            ...prevState,
            [invoiceNo]: !prevState[invoiceNo]
        }));
    };

    const handleShopSelect = (shop) => {
        setSelectedShop(shop);
        setCustomerName(shop.shopkeeperName);
        setFilteredShops([]);
    };


    return (
        <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Customer Billing</h1>

                {/* Customer Details Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                            <FaUser className="inline-block mr-2 text-gray-400" />
                            Customer Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            placeholder="Enter customer name"
                            value={customerName}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}

                        {/* Shop Dropdown */}
                        {filteredShops.length > 0 && (
                            <ul className="absolute z-10 w-[32vw] bg-white border border-gray-300 rounded-md shadow-md mt-1 ">
                                {filteredShops.map((shop) => (
                                    <li
                                        key={shop._id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleShopSelect(shop)}
                                    >
                                        {shop.shopkeeperName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            <FaAddressCard className="inline-block mr-2 text-gray-400" />
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Enter address"
                            value={address}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            <FaCalendarAlt className="inline-block mr-2 text-gray-400" />
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={date}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="oldBalance" className="block text-sm font-medium text-gray-700">
                            <FaMoneyBillWave className="inline-block mr-2 text-gray-400" />
                            Old Balance
                        </label>
                        <input
                            type="number"
                            name="oldBalance"
                            id="oldBalance"
                            placeholder="Enter old balance"
                            value={oldBalance}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="customerGivenAmount" className="block text-sm font-medium text-gray-700">
                            <FaHandHoldingUsd className="inline-block mr-2 text-gray-400" />
                            Given Amount
                        </label>
                        <input
                            type="number"
                            name="customerGivenAmount"
                            id="customerGivenAmount"
                            placeholder="Enter amount given by customer"
                            value={customerGivenAmount}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">
                            <FaTags className="inline-block mr-2 text-gray-400" />
                            Discount (%)
                        </label>
                        <input
                            type="number"
                            name="discountPercentage"
                            id="discountPercentage"
                            placeholder="Enter discount percentage"
                            value={discountPercentage}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                        />
                    </div>
                </div>

                {/* Add Item Form */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Items</h2>
                    {errors.newItem && <p className="text-red-500 text-xs mt-1">{errors.newItem}</p>}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="relative rounded-md shadow-sm">
                            <select
                                id="newItemName"
                                name="newItemName"
                                value={newItem.name}
                                onChange={handleInputChange}
                                className="focus:ring-blue-500 hover:ring-blue-400 focus:border-blue-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                            >
                                <option value="">Select Item</option>
                                {inventoryData.map((item, index) => (
                                    <option key={index} value={item.itemName}>{item.itemName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="number"
                                name="newItemQuantity"
                                id="newItemQuantity"
                                placeholder="Quantity"
                                value={newItem.quantity}
                                onChange={handleInputChange}
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="number"
                                name="newItemPrice"
                                id="newItemPrice"
                                placeholder="Price"
                                value={newItem.price}
                                onChange={handleInputChange}
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
                    >
                        <MdAddShoppingCart className="mr-2" />
                        Add Item
                    </button>
                </div>

                {/* Cart Table */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Bill</h2>
                    {errors.cart && <p className="text-red-500 text-xs mt-1">{errors.cart}</p>}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cart.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">PKR {item.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">PKR {item.total}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleRemoveItem(index)}
                                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals and Generate Bill Button */}
                <div className="mb-6">
                    <p className="text-lg font-semibold text-gray-700">Total Amount: PKR {cart.reduce((acc, item) => acc + item.total, 0).toFixed(2)}</p>
                    <p className="text-lg font-semibold text-gray-700">Total After Discount: PKR {(cart.reduce((acc, item) => acc + item.total, 0) - ((discountPercentage / 100) * cart.reduce((acc, item) => acc + item.total, 0))).toFixed(2)}</p>
                    <p className="text-lg font-semibold text-gray-700">Net Amount: PKR {((cart.reduce((acc, item) => acc + item.total, 0) - ((discountPercentage / 100) * cart.reduce((acc, item) => acc + item.total, 0))) + parseFloat(oldBalance || 0)).toFixed(2)}</p>

                    <p className="text-lg font-semibold text-gray-700">Remaining: PKR {(((cart.reduce((acc, item) => acc + item.total, 0) - ((discountPercentage / 100) * cart.reduce((acc, item) => acc + item.total, 0))) + parseFloat(oldBalance || 0)) - parseFloat(customerGivenAmount || 0)).toFixed(2)}</p>
                    <button
                        onClick={handleGenerateBill}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
                    >
                        <MdReceipt className="mr-2" />
                        Generate Bill
                    </button>
                </div>

                {/* Bills List */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Generated Bills</h2>
                    <div className="overflow-x-auto">
                        {bills.map((bill) => (
                            <div key={bill.invoiceNo} className="bg-gray-100 p-4 rounded-md shadow mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-700">Invoice #{bill.invoiceNo}</h3>
                                    <div>
                                        <button onClick={() => handlePrint(bill)} className="text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-4 flex items-center">
                                            <MdPrint className="mr-1" /> Print
                                        </button>
                                        <button onClick={() => toggleDetails(bill.invoiceNo)} className="text-gray-600 hover:text-gray-800 focus:outline-none transition-colors duration-200">
                                            {showDetails[bill.invoiceNo] ? <MdKeyboardDoubleArrowUp className="h-6 w-6 text-gray-500" /> : <MdKeyboardDoubleArrowDown className="h-6 w-6 text-gray-500" />}
                                        </button>
                                    </div>
                                </div>
                                {showDetails[bill.invoiceNo] && (
                                    <>
                                        <p className="text-gray-600"><strong>Customer:</strong> {bill.customerName}</p>
                                        <p className="text-gray-600"><strong>Date:</strong> {bill.date}</p>
                                        <p className="text-gray-600"><strong>Total Amount:</strong> PKR {bill.totalAmount.toFixed(2)}</p>
                                        <p className="text-gray-600"><strong>Discount:</strong> {bill.discountPercentage}% (PKR {bill.discountAmount.toFixed(2)})</p>
                                        <p className="text-gray-600"><strong>Total After Discount:</strong> PKR {bill.totalAfterDiscount.toFixed(2)}</p>
                                        <p className="text-gray-600"><strong>Old Balance:</strong> PKR {bill.oldBalance.toFixed(2)}</p>

                                        <p className="text-gray-600"><strong>Net Amount:</strong> PKR {bill.netAmount.toFixed(2)}</p>
                                        <p className="text-gray-600"><strong>Given Amount:</strong> PKR {bill.customerGivenAmount.toFixed(2)}</p>
                                        <p className="text-gray-600"><strong>Remaining Amount:</strong> PKR {bill.debt.toFixed(2)}</p>
                                        {/* Display other bill details */}
                                        <div className="mt-2">
                                            <h4 className="text-md font-semibold text-gray-700">Items:</h4>
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead>
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">

                                                    {bill.cart.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">PKR {item.price}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">PKR {item.total}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerBilling;