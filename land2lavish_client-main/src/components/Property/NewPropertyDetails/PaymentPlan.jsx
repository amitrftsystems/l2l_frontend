import React from "react";

const PaymentPlan = () => {
  return (
    <>
      <div
        className="ml-10 text-2xl text-blue-900 font-semibold
      "
      >
        <h1>PAYMENT PLAN</h1>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 md:p-12 rounded-xl shadow-lg">
        {/* Price Section */}
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 p-3 rounded-lg">
            <span className="text-orange-600 text-xl">🏷️</span>
          </div>
          <div>
            <p className="text-orange-600 text-2xl font-bold">₹ 30 lakh</p>
            <p className="text-sm text-gray-600">EXPECTED PRICE</p>
          </div>
        </div>

        {/* Handover Section */}
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 p-3 rounded-lg">
            <span className="text-orange-600 text-xl">💳</span>
          </div>
          <div>
            <p className="text-orange-600 text-2xl font-bold">₹ 15000</p>
            <p className="text-sm text-gray-600">PRICE PER SQUARE Ft</p>
          </div>
        </div>

        {/* Payment Plan Section */}
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 p-3 rounded-lg">
            <span className="text-orange-600 text-xl">💰</span>
          </div>
          <div>
            <p className="text-orange-600 text-2xl font-bold">Yes</p>
            <p className="text-sm text-gray-600">PRICE NEGOTIABLE</p>
          </div>
        </div>

        {/* Button Section */}
        <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
          Book Now
        </button>
      </div>
    </>
  );
};

export default PaymentPlan;
