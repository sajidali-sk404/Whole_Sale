"use client"
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import BillDetails from '../printBill/component/BillDetails';
import SearchBar from './component/SearchBar';
import { AuthContext } from '@/app/ContextApi/AuthContextApi';

function AllBills() {
  const { isAuthenticated } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState(0);
  const [showDetails, setShowDetails] = useState({});
  const watermarkImageUrl = '/watermark_p.PNG';

  useEffect(() => {
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = "/";
      }
    }
  }, [isAuthenticated]);

  const toggleDetails = (invoiceNo) => {
    setShowDetails((prevShowDetails) => ({
      ...prevShowDetails,
      [invoiceNo]: !prevShowDetails[invoiceNo],
    }));
  }



  const handleDeleteBill = async (invoiceNo) => {
    try {
      const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/bills/${invoiceNo}`, { // Protected route
        headers: {
          'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
          'Content-Type': 'application/json', // Or any content type your API expects
        },
      });
      setBills((prevBills) => prevBills.filter((bill) => bill.invoiceNo !== invoiceNo));
    } catch (err) {
      console.error("Error deleting bill:", err);
    }
  };

  const handlePrint = (bills) => {
    const printContent = `
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sale Invoice</title>
        <style>
      /* --- Base Styles --- */
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box; /* More predictable sizing */
      }
    
      .invoice-container {
        width: 95%;
        max-width: 800px;
        margin: 20px auto;
        background: white;
        padding: 20px;
        position: relative;
        overflow: hidden; /* Prevents content from overflowing the container */
      }
    
      /* --- Watermark Styles --- */
      .watermark-repeat {
        position: absolute;
        top: -300px; /* Use px for consistent positioning */
        left: -130px; /* Use px for consistent positioning */
        width: 150%;
        height: 150%;
        background-image: url(${watermarkImageUrl});
        background-size: 100%;
        background-repeat: repeat;
        transform: rotate(-20deg);
        transform-origin: center;
        background-position: center;
        opacity: 0.2;
        z-index: 0;
        pointer-events: none; /* Avoid interfering with clicks */
      }
    
      .watermark-center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50%;
        opacity: 0.15;
        z-index: 0;
        pointer-events: none; /* Avoid interfering with clicks */
      }
    
      /* --- Header Styles --- */
      .header {
        text-align: center;
        margin-bottom: 10px;
        position: relative; /* For absolute positioning of elements within */
      }
    
      .header h1 {
        margin: 0;
        color: #333;
        font-size: 24px; /* Consistent font size */
        font-weight: bold; /* Use font-weight for boldness */
      }
    
      .header p {
        color: #666;
        margin: 5px 0;
        font-size: 14px; /* Consistent font size */
      }
    
      /* --- Details Table Styles --- */
      .details {
        width: 100%;
        margin-bottom: 20px;
        table-layout: fixed; /* Ensures equal column widths */
      }
    
      .details td {
        padding: 5px;
        word-break: break-word; /* Prevents long words from breaking the layout */
      }
    
      .details strong {
        color: #333;
        font-weight: 600; /* Use font-weight for boldness */
      }
    
      /* --- Table Container Styles --- */
      .table-container {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
    
      .table-container th,
      .table-container td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
        word-wrap: break-word;
      }
    
      .table-container th {
        background-color: #f2f2f2;
        font-weight: bold; /* Make headers more prominent */
      }
    
      /* --- Summary Table Styles --- */
      .summary-table {
        width: 100%;
        margin-left: auto;
        border-collapse: collapse;
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
        font-weight: 600; /* Use font-weight for emphasis */
      }
    
      /* --- Footer Styles --- */
      .footer {
        margin-top: 20px;
        text-align: center;
        font-size: 12px;
        color: #666;
        border-top: 1px solid #ddd;
        padding-top: 10px;
        z-index: 1; /* Ensure footer is above other elements */
      }
    
      /* --- Signature Styles --- */
      .signature {
        font-size: 11px;
        text-align: left;
        margin-top: 80px;
        color: #333;
      }
    
      .signature span {
        margin-right: 30px;
      }
    
      /* --- Gen Styles --- */
      .gen {
        text-align: right;
        margin-top: 20px;
      }
    
      .gen p {
        margin: 5px 0;
        font-size: 12px;
      }
    
      /* --- Media Queries for Responsiveness --- */
      @media (max-width: 768px) {
        .invoice-container {
          width: 95%;
          padding: 10px;
        }
    
        .table-container th,
        .table-container td {
          padding: 5px;
          font-size: 11px;
        }
    
        .summary-table td {
          padding: 3px;
          font-size: 11px;
        }
    
        .header h1 {
          font-size: 18px;
        }
    
        .header p {
          font-size: 11px;
        }
    
        .watermark-center {
          width: 70%;
        }
      }
    
      /* --- Print Styles --- */
      @page {
      size: auto;  /* Let the browser determine the page size */
      margin: 0;   /* Remove default margins */
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact; /* Ensure colors are printed correctly */
        print-color-adjust: exact;
      }
    
      .watermark-repeat, .watermark-center {
        display: block !important;   /* Force watermark to display */
        background-image: url(${watermarkImageUrl}) !important;
        background-size: 100% !important;
        background-repeat: repeat !important;
        opacity: 0.2 !important;    /* Ensure the watermark is visible */
      }
        /* Adjust margins for printing */
        .invoice-container {
          margin: 0;
          padding: 0;
          width: 100%;
          max-width: none;
        }
         .header {
                margin-bottom: 5px;
            }
    
            .header h1 {
                font-size: 20px;
            }
    
            .header p {
                font-size: 10px;
            }
      }
    </style>
      </head>
    
      <body>
        <div class="invoice-container ">
          <div class="watermark-repeat"></div>
    
          <div class="header">
            <h1>M.Amir Traders</h1>
            <p>Whole Sale Distributor Sugar, Ghee, Wheat etc</p>
            <p>Watkay Chowk Shadara Mingora Swat</p>
            <p>Ph#: 0341-6120696, 0946-818811</p>
          </div>
    
          <table class="details">
            <tr>
              <td><strong>Code:</strong> 1200</td>
              <td><strong>Invoice No:</strong> ${bills.invoiceNo}</td>
            </tr>
            <tr>
              <td><strong>Name:</strong> ${bills.customerName}</td>
              <td>
                <strong>Date:</strong>
                ${new Date(bills.date).toISOString().split('T')[0]}
              </td>
            </tr>
            <tr>
              <td><strong>Address:</strong> ${bills.address}</td>
              <td><strong>Mob#:</strong></td>
            </tr>
            <tr>
              <td><strong>Ref. Name:</strong> SWAT</td>
              <td><strong>CNIC#:</strong></td>
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
              ${bills.cart
        .map(
          (item, index) => `
                            <tr key=${index}>
                                <td>${item.quantity}</td>
                                <td>${item.itemName}</td>
                                <td>${item.price} PKR</td>
                                <td>${item.total} PKR</td>
                            </tr>
                        `
        )
        .join('')}
            </tbody>
          </table>
          <table class="summary-table">
            <tr>
              <td><strong>Total Amount</strong></td>
              <td>${bills.totalAmount.toFixed(2)} PKR</td>
            </tr>
            <tr>
              <td><strong>Discount:</strong></td>
              <td>${bills.discountAmount.toFixed(2)} PKR</td>
            </tr>
            <tr>
              <td><strong>Total After Discount:</strong></td>
              <td>${bills.totalAfterDiscount.toFixed(2)} PKR</td>
            </tr>
            <tr>
              <td><strong>Old Balance:</strong></td>
              <td>${bills.oldBalance.toFixed(2)} PKR</td>
            </tr>
            <tr>
              <td><strong>Net Bill Amount:</strong></td>
              <td>${bills.netAmount.toFixed(2)} PKR</td>
            </tr>
            <tr>
              <td><strong>Given Amount</strong></td>
              <td>${bills.customerGivenAmount.toFixed(2)} PKR</td>
            </tr>
            <tr>
              <td><strong>Remaining Amount</strong></td>
              <td>${bills.debt.toFixed(2)} PKR</td>
            </tr>
          </table>
    
          <div class="signature">
            <span><strong>Generated By: ___________________</strong></span>
            <span><strong>Store Manager: ___________________</strong> </span>
          </div>
          <div class="gen">
            <p style="margin-left: 100px;">
              <strong> نوٹ</strong> مال وصول کرتے وقت اچھی طرح چیک کرلیں بعد میں کمپنی لیکیج کو کمی کی
              ذمہ دار نہ ہوگی
            </p>
            <p>
              نیز فرم کے موجودہ اور سابقہ ملازمین کو ادھار سودا یا مال کے لیے پیشگی رقم نہ دیں جس کے
              لیے ہم ذمہ دار نہ ہوں گے
            </p>
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

      // Capture onafterprint inside the printWindow *before* calling print
      printWindow.onafterprint = () => {
        printWindow.close(); // Close the printWindow after printing
      };

      printWindow.print();
    } else {
      alert('Failed to open print window. Please check your browser settings.');
    }
  };


  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bills`); // Make sure your backend is running on port 5000
        setBills(response.data);
        // Set initial invoiceNo based on existing bills
        if (response.data.length > 0) {
          setInvoiceNo(Math.max(...response.data.map(bills => bills.invoiceNo)) + 1);
        } else {
          setInvoiceNo(1); // Start with 1 if no bills exist
        }
      } catch (err) {
        console.error("Error fetching bills:", err);
        setError(err.message || "Failed to fetch bills");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (!isAuthenticated) return null;

  return (
    <>
      <div className='mb-5'><SearchBar /></div>
      {/* Bills List */}
      <div className='container mx-auto px-4 sm:px-8 max-w-4xl'>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Generated Bills</h2>
        <div className="overflow-x-auto">
          {bills.map((bill) => (
            <BillDetails
              key={bill.invoiceNo}
              bill={bill}
              showDetails={showDetails}
              toggleDetails={toggleDetails}
              handleDeleteBill={handleDeleteBill}
              handlePrint={handlePrint}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default AllBills;