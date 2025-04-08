import React from "react";
import { useLocation } from "react-router-dom";
import ProjectUnitSelector from "../Homecomp/IdSection";
import TopInfo from "./TopInfo";
import ReceiptDetails from "./ReceiptDetails";
import DispatchDetails from "./DispatchDetails";

const CustInfo = () => {
  const location = useLocation(); // ✅ Get the current route

  return (
    <div>
      <TopInfo />
      {/* ✅ Hide dropdowns when on the customer-info page */}
      {location.pathname !== "/customer-info" && <ProjectUnitSelector />}
      <div className="mt-10">
        <ReceiptDetails />
      </div>
      <div className="mt-10">
        <DispatchDetails />
      </div>
    </div>
  );
};

export default CustInfo;
