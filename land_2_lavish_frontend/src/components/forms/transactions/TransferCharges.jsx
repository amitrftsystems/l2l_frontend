import React, { useState } from "react";

const TransferCharges = () => {
  const [formData, setFormData] = useState({
    customerId: "",
    paymentDate: "",
    propertySize: "",
    transferCharges: true,
    amount: 0,
    mode: "",
    chequeNo: "",
    chequeDate: "",
    drawOn: "",
    remarks: "",
    noc: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add your form submission logic here (e.g., API call)
  };

  const handleClear = () => {
    setFormData({
      customerId: "",
      paymentDate: "",
      propertySize: "",
      transferCharges: false,
      amount: 0,
      mode: "",
      chequeNo: "",
      chequeDate: "",
      drawOn: "",
      remarks: "",
      noc: false,
    });
  };

  return (
    <div className="bg-[#272727] min-h-screen p-6 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full shadow-lg text-gray-800">
        <h2 className="text-center text-2xl font-bold mb-5">
          Transfer Charges
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2 pr-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Customer ID
              </label>
              <input
                type="text"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                placeholder="Enter Customer ID"
                className="w-full p-2 rounded bg-white text-gray-800 border border-black focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-sm mb-1 font-medium  text-gray-700">
                Property ID
              </label>
              <select
                name="propertySize"
                value={formData.propertySize}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white text-gray-800 border border-black focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>

          {/* Row 2: Payment Date, Transfer Charges, and Amount */}
          <div className="flex flex-wrap gap-4 mb-4 items-center">
            {/* Payment Date */}
            <div className="w-[418px] pr-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Payment Date
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white text-gray-800 border border-black focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            {/* Transfer Charges and Amount Grouped Together */}
            <div className="flex-1 flex items-center gap-15 ml-2">
              {/* Transfer Charges */}
              <div className="flex items-center gap-10">
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="checkbox"
                    name="transferCharges"
                    checked={formData.transferCharges}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-500 border-black rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Transfer Charges</span>
                </label>
              </div>

              {/* Amount */}
              <div className="w-1/3">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Amount
                </label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-white text-gray-800 border border-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Mode, Cheque/DD No., Cheque Dt., Draw On, Remarks */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="w-1/5 pr-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Mode
              </label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white text-gray-800 border border-black focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CASH">Cash</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>
            <div className="w-[200px] pr-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Cheque/DD No.
              </label>
              <input
                type="text"
                name="chequeNo"
                value={formData.chequeNo}
                onChange={handleChange}
                placeholder="Enter Cheque/DD No."
                className="w-full p-2 rounded bg-white text-gray-800 border border-black focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="w-1/4 pr-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Cheque Dt.
              </label>
              <input
                type="date"
                name="chequeDate"
                value={formData.chequeDate}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white text-gray-800 border border-black focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="w-1/4 pr-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Draw On
              </label>
              <input
                type="text"
                name="drawOn"
                value={formData.drawOn}
                onChange={handleChange}
                placeholder="Enter Draw On"
                className="w-full p-2 rounded bg-white text-gray-800 border border-black focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="w-[830px]">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Remarks
              </label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter Remarks"
                className="w-full p-2 rounded bg-white text-gray-800 border border-black focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Row 4: N.O.C and Transferee Registration */}
          <div className="flex flex-wrap justify-between mb-4">
            <div className="flex items-center text-xl gap-2">N.O.C</div>
            <div className="text-xl">Transferee Registration</div>
          </div>

          {/* Row 5: Save and Clear Buttons */}
          <div className="flex justify-center gap-3 mb-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition"
            >
              Clear
            </button>
          </div>

          {/* Row 6: Print Receipt Button */}
          <div className="flex justify-center">
            <button
              type="button"
              className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
            >
              Print Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferCharges;
