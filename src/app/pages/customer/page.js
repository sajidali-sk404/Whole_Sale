'use client'
import { useState, useRef, useEffect } from "react";
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from "react-icons/md";

const CustomerBilling = () => {
  const [bills, setBills] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState(1); // Start at invoice number 1
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Set default to today's date
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [cart, setCart] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
  const [oldBalance, setOldBalance] = useState(0);
  const [customerGivenAmount, setCustomerGivenAmount] = useState(0); // New field for customer's given amount
  const [debt, setDebt] = useState(0); // To store customer's debt
  const [showDetails, setShowDetails] = useState({}); // Track visibility of each bill's details
  const printRef = useRef();

  // Example items for the dropdown
  const availableItems = ["Sugar", "Milk", "Ghee", "lubya", "foot"];

  // Increment invoice number after each bill generation
  useEffect(() => {
    if (bills.length > 0) {
      setInvoiceNo(bills[bills.length - 1].invoiceNo + 1); // Increment by 1
    }
  }, [bills]);

  const handleAddToCart = () => {
    if (newItem.name && newItem.quantity && newItem.price) {
      setCart([...cart, { ...newItem, total: newItem.quantity * newItem.price }]);
      setNewItem({ name: "", quantity: "", price: "" });
    }
  };

  // Calculate the debt and generate the bill
  const handleGenerateBill = () => {
    if (customerName && cart.length > 0) {
      const totalAmount = cart.reduce((acc, item) => acc + item.total, 0);
      const netAmount = totalAmount + parseFloat(oldBalance);
      const calculatedDebt = netAmount - parseFloat(customerGivenAmount);

      setDebt(calculatedDebt); // Store debt

      const newBill = {
        invoiceNo,
        date,
        customerName,
        address,
        cart,
        totalAmount,
        oldBalance,
        netAmount,
        customerGivenAmount,
        debt: calculatedDebt
      };

      setBills([...bills, newBill]);

      // Toggle details visibility for the new bill (default hidden)
      setShowDetails({ ...showDetails, [invoiceNo]: false });

      // Reset form fields except invoiceNo and date
      setCustomerName("");
      setAddress("");
      setCart([]);
      setOldBalance(0);
      setCustomerGivenAmount(0);

      // Auto increment invoice number for the next bill
      setInvoiceNo(invoiceNo + 1);

      // Set current date for the next bill
      setDate(new Date().toISOString().split('T')[0]);
    }
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
        }
        .invoice-container {
            width: 700px;
            margin: 0 auto;
            border: 1px solid #000;
            padding: 10px;
        }
        .header {
            text-align: center;
            margin-bottom: 10px;
        }
        .header h1 {
            margin: 0;
        }
        .details {
            width: 100%;
            margin-bottom: 20px;
        }
        .details td {
            padding: 5px;
        }
        .table-container {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table-container th, .table-container td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
        }
        .summary-table td {           
            padding: 5px;      
            text-align: right;
            margin-left:30%
        }
            
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
        }
        .signature {
            text-align: left;
            margin-top: 50px;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>GK Traders</h1>
            <p>Distributor Shama Ghee, C.Oil, Sugar & Pvt. Ghee</p>
            <p>Bypass Chowk, Fizaghat Mingora Swat</p>
            <p>Ph#: 0946-711500, 813364, 0346-9408399</p>
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
                 ${bill.cart.map(item => `
                <tr>
                <td>${item.quantity}</td>
                  <td>${item.name}</td>
                  <td>${item.price} PKR</td>
                  <td>${item.total} PKR</td>
                </tr>
              `).join('')}
            </tbody>
        </table>

        <table class="summary-table" style="width: 100%;">
            <tr>
                <td><strong>Total Amount</strong></td>
                <td>${bill.totalAmount} PKR</td>
            </tr>
            <tr>
                <td><strong>Total Discount:</strong></td>
                <td>0</td>
            </tr>
            <tr>
                <td><strong>Net Bill Amount:</strong></td>
                <td>${bill.netAmount} PKR</td>
            </tr>
            <tr>
                <td><strong>Given Amount</strong></td>
                <td>${bill.customerGivenAmount} PKR</td>
            </tr>
            <tr>
                <td><strong>Remaining Amount</strong></td>
                <td>${bill.debt} PKR</td>
            </tr>
            <tr>
                <td><strong>Tax % Value:</strong></td>
                <td>0.00</td>
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
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Toggle the visibility of the bill details (Customer Name, Date)
  const toggleDetails = (invoiceNo) => {
    setShowDetails(prevState => ({
      ...prevState,
      [invoiceNo]: !prevState[invoiceNo]
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Customer Billing</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Invoice No"
          value={invoiceNo}
          onChange={(e) => setInvoiceNo(e.target.value)}
          className="border p-2 mr-2 rounded w-full"
          readOnly // Make invoice number read-only
        />
      </div>

      <div className="mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 mr-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border p-2 mr-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 mr-2 rounded w-full"
        />
      </div>

      <div className="mb-4 flex space-x-2">
        {/* Dropdown for Item Names */}
        <select
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2 rounded w-1/3"
        >
          <option value="">Select Item</option>
          {availableItems.map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          className="border p-2 rounded w-1/3"
        />
        <input
          type="number"
          placeholder="Price per unit"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="border p-2 rounded w-1/3"
        />
        <button onClick={handleAddToCart} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>

      <h3 className="text-lg font-semibold mt-4">Current Bill</h3>
      <table className="w-full border-collapse border border-gray-300 mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Item Name</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{item.price} PKR</td>
              <td className="border p-2">{item.total} PKR</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className=" font-bold mt-4">
        Total Amount: {cart.reduce((acc, item) => acc + item.total, 0)} PKR
      </h3>

      <div className="mb-4">
        <span>Old Amount</span>
        <input
          type="number"
          placeholder="Old Amount"
          value={oldBalance}
          onChange={(e) => setOldBalance(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <h3 className=" font-bold mt-4">
        Net Amount: {cart.reduce((acc, item) => acc + item.total, 0) + parseFloat(oldBalance)} PKR
      </h3>

      <div className="mb-4">
        <span>Given Amount:</span>
        <input
          type="number"
          placeholder="Given Amount"
          value={customerGivenAmount}
          onChange={(e) => setCustomerGivenAmount(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <button onClick={handleGenerateBill} className="bg-green-500 text-white px-4 py-2 rounded mt-4">Generate Bill</button>

      {/* Bills List */}
      <h3 className="text-xl font-bold mt-6">Generated Bills</h3>
      {bills.map((bill, index) => (
        <div key={index} className="border p-4  rounded my-2">
          <div className="flex justify-between items-center">
            <p><strong>Invoice No:</strong> {bill.invoiceNo}</p>
            <p><strong>Customer:</strong> {bill.customerName}</p>
            <p><strong>Date:</strong> {bill.date}</p>





            <button onClick={() => handlePrint(bill)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Print Bill</button>
            {/* Toggle button to show/hide details */}
            <button
              onClick={() => toggleDetails(bill.invoiceNo)}
              className="  px-4 py-2 rounded mt-2"
            >
              {showDetails[bill.invoiceNo] ? <MdKeyboardDoubleArrowUp className="h-6 w-6 text-gray-500" />
                : <MdKeyboardDoubleArrowDown className="h-6 w-6 text-gray-500" />}
            </button>
          </div>

          {/* Conditionally show details based on toggle */}
          {showDetails[bill.invoiceNo] && (
            <div className="flex flex-col">

              <p><strong>Total Amount:</strong> {bill.totalAmount} PKR</p>
              <p><strong>Old Amount:</strong> {bill.oldBalance} PKR</p>
              <p><strong>Net Amount:</strong> {bill.netAmount} PKR</p>
              <p><strong>Given Amount:</strong> {bill.customerGivenAmount} PKR</p>
              <p><strong>Remaining Amount:</strong> {bill.debt} PKR</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomerBilling;
