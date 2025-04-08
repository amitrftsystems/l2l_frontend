import React, { useState, useEffect } from "react";

const AuditInfo = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <div className="p-5 mr-3 w-1/2 mx-auto border border-gray-300 rounded-md shadow-md">
      {/* Dynamic Date and Time */}
      <p className="text-lg font-semibold">
        <span className="text-black">Date:</span>{" "}
        <span className="text-blue-500">
          {currentDateTime.toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </span>
      </p>

      <p className="text-lg font-semibold">
        <span className="text-black">Last Audited By:</span>{" "}
      </p>

      {/* Static Links and Text */}
      <ul className="mt-3 space-y-2">
        <li className="text-blue-500 cursor-pointer">
          ➤ Add/Remove Blue Prompts
        </li>
        <li className="text-blue-500 cursor-pointer">
          ➤ Deleted Pop-up History
        </li>
        <li className="text-black">
          ➤ AL || Re-AL 🔄 Indemnity || Services || NOC
        </li>
        <li className="text-blue-500 cursor-pointer">
          ➤ Edit Customer Details || Register Floor Buyer
        </li>
        <li className="text-blue-500 cursor-pointer">
          ➤ Payment Schedule 🔄 Cust Feedback
        </li>
        <li className="text-black">
          ➤ BBA Doc ➜{" "}
          <span className="text-blue-500 cursor-pointer">BBA1 Doc</span> ➜{" "}
          <span className="text-blue-500 cursor-pointer">BBA2 Doc</span> 🔄
          Indemnity
        </li>
        <li className="text-black">➤ Possession Letter 🔄 New Invite Letter</li>
        <li className="text-black">➤ Refund</li>
      </ul>
    </div>
  );
};

export default AuditInfo;
