import React, { useState, useCallback, useMemo, useContext } from 'react';
import { TrashIcon } from "@heroicons/react/24/outline";
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp, MdPrint } from "react-icons/md";
import { formatCurrency, formatDate } from './utils'; // Import utility functions
import { AuthContext } from '@/app/ContextApi/AuthContextApi';

const BillDetails = React.memo(({ bill, handleDeleteBill, handlePrint }) => {  // Use React.memo for performance optimization
  const [showDetails, setShowDetails] = useState(false);
  const {userRole} = useContext(AuthContext);

  // Use useCallback to memoize the toggleDetails function
  const toggleDetails = useCallback(() => {
    setShowDetails(prevShowDetails => !prevShowDetails);
  }, []); // No dependencies needed

  // Memoize the formatted bill data to avoid recalculations on every render
  const memoizedBillData = useMemo(() => {
    return {
      customerName: bill.customerName,
      formattedDate: formatDate(bill.date),
      formattedTotalAmount: formatCurrency(bill.totalAmount),
      discountPercentage: bill.discountPercentage,
      formattedDiscountAmount: formatCurrency(bill.discountAmount),
      formattedTotalAfterDiscount: formatCurrency(bill.totalAfterDiscount),
      formattedOldBalance: formatCurrency(bill.oldBalance),
      formattedNetAmount: formatCurrency(bill.netAmount),
      formattedCustomerGivenAmount: formatCurrency(bill.customerGivenAmount),
      formattedDebt: formatCurrency(bill.debt),
    };
  }, [bill]); // Only recalculate when 'bill' prop changes

  // Memoize the item list for performance
  const memoizedItems = useMemo(() => {
    return bill.cart.map(item => ({
      ...item,
      formattedPrice: formatCurrency(item.price),
      formattedTotal: formatCurrency(item.total),
    }));
  }, [bill.cart]);

  const handleDelete = useCallback(() => {
    handleDeleteBill(bill.invoiceNo);
  }, [handleDeleteBill, bill.invoiceNo]);

  const handlePrintBill = useCallback(() => {
    handlePrint(bill);
  }, [handlePrint, bill]);

  return (
    <div key={bill.invoiceNo} className="bg-white p-4 rounded-md shadow-md mb-4 border border-gray-200">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Invoice #<span className="text-blue-500">{bill.invoiceNo}</span>
        </h3>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
        {userRole === 'admin' && 
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200"
            aria-label="Delete Invoice"
          >
            <TrashIcon className="w-5 h-5" />
          </button>}
          <button
            onClick={handlePrintBill}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none transition-colors duration-200 flex items-center"
          >
            <MdPrint className="mr-2" /> Print
          </button>
          <button
            onClick={toggleDetails}
            className="focus:outline-none transition-colors duration-200"
            aria-label="Toggle Details"
          >
            {showDetails ? (
              <MdKeyboardDoubleArrowUp className="h-6 w-6 text-gray-600 hover:text-gray-800" />
            ) : (
              <MdKeyboardDoubleArrowDown className="h-6 w-6 text-gray-600 hover:text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Details Section */}
      {showDetails && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700 text-sm">
                <strong>Customer:</strong> {memoizedBillData.customerName}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Date:</strong> {memoizedBillData.formattedDate}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Total Amount:</strong> {memoizedBillData.formattedTotalAmount}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Discount:</strong> {memoizedBillData.discountPercentage}% ({memoizedBillData.formattedDiscountAmount})
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Total After Discount:</strong> {memoizedBillData.formattedTotalAfterDiscount}
              </p>
            </div>
            <div>
              <p className="text-gray-700 text-sm">
                <strong>Old Balance:</strong> {memoizedBillData.formattedOldBalance}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Net Amount:</strong> {memoizedBillData.formattedNetAmount}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Given Amount:</strong> {memoizedBillData.formattedCustomerGivenAmount}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Remaining Amount:</strong> {memoizedBillData.formattedDebt}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-4">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Items:</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {memoizedItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.itemName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.quantity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.formattedPrice}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.formattedTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

BillDetails.displayName = 'BillDetails';

export default BillDetails;