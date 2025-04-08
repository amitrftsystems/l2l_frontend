import React, { useState } from "react";

const PaymentReceiptForm = () => {
  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [chequeDate, setChequeDate] = useState(getCurrentDate());
  const [unitSize, setUnitSize] = useState("");
  const [unitType, setUnitType] = useState("sq.ft");
  const [propertyDescription, setPropertyDescription] = useState("1 BHK Affordable Residential Flat");
  const [unitNumber, setUnitNumber] = useState("A-101"); // Default unit number

  // Mock function to simulate database fetch for property description
  const fetchPropertyDescription = () => {
    console.log("Fetching property description from database...");
    // In a real implementation, this would be an API call
    // setPropertyDescription(fetchedData);
  };

  // Mock function to simulate database fetch for unit number
  const fetchUnitNumber = () => {
    console.log("Fetching unit number from database...");
    // Simulating a database fetch with a timeout
    setTimeout(() => {
      setUnitNumber("A-203"); // This would normally come from an API response
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#272727] flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        {/* Header Section */}
        <h1 className="text-2xl font-bold text-center mb-1">PAYMENT RECEIPT</h1>
        <p className="text-sm text-center text-[#272727] mb-2">
          Fields marked by <span className="text-red-500">*</span> are mandatory
        </p>

        {/* Top Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Left Column */}
          <div className="bg-blue-200 p-2 rounded">
            <div className="flex items-center mb-2">
              <label className="w-1/4">Date</label>
              <div className="w-3/4">
                <input
                  type="date"
                  className="border border-gray-400 px-2 py-1 w-full bg-white"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getCurrentDate()} // Only allows current date and future dates
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="block">Manual Receipt No.</label>
              <div className="relative">
                <span className="absolute -top-3 right-0 bg-yellow-300 text-xs px-1">NEW</span>
                <input
                  type="text"
                  className="border border-gray-400 px-2 py-1 w-full bg-white"
                />
              </div>
            </div>

            <div className="flex items-center mb-2">
              <label className="w-1/4">Customer ID</label>
              <input
                type="text"
                className="border border-gray-400 px-2 py-1 w-3/4 bg-white"
                defaultValue="C/RG-00953"
              />
            </div>

            <div className="flex items-center mb-2">
              <label className="w-1/4">
                Booking Receipt <span className="text-red-500">**</span>
              </label>
              <input type="checkbox" className="mr-2" />
              <label className="mr-2">Unit Size</label>
              <input
                type="text"
                className="border border-gray-400 px-2 py-1 w-1/3 bg-white"
                value={unitSize}
                onChange={(e) => setUnitSize(e.target.value)}
              />
              <span className="mx-2">Sq. Ft.</span>
              <input type="checkbox" className="mr-2" />
            </div>

            <div className="flex items-center mb-2">
              <label className="w-1/4">Property Description</label>
              <select
                className="border border-gray-400 px-2 py-1 w-3/4 bg-white"
                value={propertyDescription}
                onChange={(e) => setPropertyDescription(e.target.value)}
              >
                <option value="1 BHK Affordable Residential Flat">
                  1 BHK Affordable Residential Flat
                </option>
              </select>
            </div>

            <div className="flex items-center mb-2">
              <label className="w-1/4">Receiving (Cash+Cheque)</label>
              <label className="w-1/4 ml-2">Cash Amount</label>
              <input
                type="text"
                className="border border-gray-400 px-2 py-1 w-1/4 bg-white"
              />
              <label className="ml-2">Cheque Amount</label>
              <input
                type="text"
                className="border border-gray-400 px-2 py-1 w-1/4 bg-white"
              />
              <span className="ml-2 text-xs text-red-500">
                @ This is only for Booking Receipt
              </span>
            </div>

            <div className="flex items-center">
              <label className="w-1/4">Deposited In</label>
              <input type="checkbox" className="mr-2" />
              <label className="mr-2">Bank</label>
              <select className="border border-gray-400 px-2 py-1 w-1/4 bg-white">
                <option>Select</option>
              </select>
              <label className="mx-2">Branch</label>
              <select className="border border-gray-400 px-2 py-1 w-1/6 bg-white">
                <option></option>
              </select>
              <span className="ml-2">XXXX</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="bg-blue-200 p-2 rounded">
            {/* Add content here if needed; currently empty in your original code */}
            <p className="text-center text-gray-600">Right column content goes here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptForm;