import React from "react";
import Navbar from "./CustNabvar"; // Path remains the same
import { useProjectUnit } from "../Data/ProjectUnitContext"; // Updated path
import { Details } from "../Data/CustomerInfo";
import AuditInfo from "./AuditInfo";
const TopInfo = () => {
  const { selectedUnit } = useProjectUnit();

  // Find the customer whose customerID matches the selectedUnit
  const customerDetails = Details.find(
    (customer) => customer.customerID === selectedUnit
  );

  return (
    <div>
      <Navbar />
      <h1 className="mt-5 text-lg font-bold text-green-500 flex justify-center">
        CUSTOMER INFO
      </h1>
      <h1 className="mt-5 text-lg font-bold text-green-500 flex justify-center">
        {selectedUnit ? `Selected Unit: ${selectedUnit}` : "No Unit Selected"}
      </h1>

      {/* Layout Container */}
      <div className="flex justify-center mt-5 space-x-5">
        {/* Customer Info Section */}
        {customerDetails ? (
          <div className="p-5 ml-3 border border-gray-300 rounded-md w-1/2 shadow-md">
            <p className="text-md font-semibold">
              <span className="text-black">Customer ID:</span>{" "}
              <span className="text-blue-500">
                {customerDetails.customerID}
              </span>
            </p>
            <p className="text-md font-semibold">
              <span className="text-black">Applicant Name:</span>{" "}
              <span className="text-blue-600">
                {customerDetails.applicantName}
              </span>
            </p>
            <p className="text-md">
              <span className="text-black font-semibold">Address:</span>{" "}
              {customerDetails.address}
            </p>
            <p className="text-md">
              <span className="text-black font-semibold">S/O/W/O/D/O:</span>{" "}
              {customerDetails.fatherName}
            </p>
            <p className="text-md">
              <span className="text-black font-semibold">
                PAN No. / Aadhar No:
              </span>{" "}
              <span className="text-blue-500">{customerDetails.panAadhar}</span>
            </p>
            <p className="text-md">
              <span className="text-black font-semibold">Phone:</span>{" "}
              <span className="text-green-600">{customerDetails.phone}</span>
            </p>
            <p className="text-md">
              <span className="text-black font-semibold">E-Mail ID:</span>{" "}
              <span className="text-red-500">{customerDetails.email}</span>
            </p>

            {/* Unit Details Section */}
            <h2 className="text-lg font-bold text-green-500 mt-4">
              Unit Details
            </h2>
            <p className="text-md">
              <span className="text-black font-semibold">Unit No:</span>{" "}
              <span className="text-blue-500">{customerDetails.unitNo}</span>
            </p>
            <p className="text-md">
              <span className="text-black font-semibold">Rate:</span>{" "}
              {customerDetails.rate}
            </p>
            <p className="text-md">
              <span className="text-black font-semibold">Unit Size:</span>{" "}
              {customerDetails.unitSize}
            </p>
            <p className="text-md">
              <span className="text-black font-semibold">Plan:</span>{" "}
              {customerDetails.plan}
            </p>
            <p className="text-md">
              <span className="text-black font-semibold">
                Unit Description:
              </span>{" "}
              {customerDetails.unitDescription}
            </p>
            <p className="text-md font-semibold">
              <span className="text-black">BBA Status:</span>{" "}
              <span className="text-green-600">
                {customerDetails.bbaStatus}
              </span>
            </p>
          </div>
        ) : (
          <h2 className="text-red-500 text-lg text-center mt-5">
            No customer details found for the selected unit.
          </h2>
        )}

        {/* Audit Info Section */}
        <AuditInfo />
      </div>
    </div>
  );
};

export default TopInfo;
