import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import ListingForm from "./pages/ListingForm";
import HomePage from "./pages/homepage/HomePage.jsx";
import CustInfo from "./pages/CustomerInfoPage.jsx";
import { ProjectUnitProvider } from "./components/Data/ProjectUnitContext.jsx";

import Booking from "./components/forms/transactions/Booking.jsx";
import MoneyReceipt from "./components/forms/transactions/MoneyReceipt.jsx";
import UnitNoAllotment from "./components/forms/transactions/UnitNoAllotment.jsx";
import CallingFeedback from "./components/forms/transactions/CallingFeedback.jsx";
import TransferCharges from "./components/forms/transactions/TransferCharges.jsx";

{
  /*Masters imports */
}
import AddNewPlan from "./components/forms/master/plans/AddNewPlan.jsx";
import AddProject from "./components/forms/master/projects/AddProject.jsx";
import AddNewPLC from "./components/forms/master/plc/AddNewPLC.jsx";
import AddPropertySize from "./components/forms/master/projects/AddProjectSize.jsx";
import Stock from "./components/forms/master/stock/Stock.jsx";
import Broker from "./components/forms/master/broker/AddBroker.jsx";
import CustomerRegistration from "./components/forms/master/customer/CustomerRegistration.jsx";
import CustomerEdit from "./components/forms/master/customer/CustomerEdit.jsx";
import AddCoApplicant from "./components/forms/master/co-applicant/CoApplicant.jsx";
import LeanBank from "./components/forms/master/leanbank/LeanBank.jsx";

import Login from "./login/Login.jsx";
import SuperAdminDashboard from "./superAdminDashboard/SuperadminDashboard.jsx";
import SuperAdminNavbar from "./superAdminDashboard/SuperAdminNavbar.jsx";

{/* Utilities imports */}
import Employees from "./components/utilites/Employee.jsx";
import AllotmentLetter from "./components/utilites/AllotmentLetter.jsx";
import LogReports from "./components/utilites/LogReports.jsx";
import UpcomingBirthdays from "./components/utilites/Birthdays.jsx";

{/*transaction imports */}
import BBAForm from "./components/forms/transactions/BbaForm.jsx";
import DespatchForm from "./components/forms/transactions/DespatchForm.jsx";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <ProjectUnitProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/unauthorized" element={<div>Unauthorized Access!</div>} />
          
          {/* Superadmin Routes */}
          <Route path="/superadmin" element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <Navigate to="/superadmin/dashboard" replace />
            </ProtectedRoute>
          } />
          <Route path="/superadmin/dashboard" element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <SuperAdminNavbar />
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <HomePage />
            </ProtectedRoute>
          } />
          
          {/* Employee Routes */}
          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <HomePage />
            </ProtectedRoute>
          } />

          {/* Other protected routes */}
          <Route path="/customer-info" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <CustInfo />
            </ProtectedRoute>
          } />
          <Route path="/List-your-property" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <ListingForm />
            </ProtectedRoute>
          } />

          {/* Masters Routes */}
          <Route path="/masters/add-new-plan" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <AddNewPlan />
            </ProtectedRoute>
          } />
          <Route path="/masters/add-project" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <AddProject />
            </ProtectedRoute>
          } />
          <Route path="/masters/add-new-plc" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <AddNewPLC />
            </ProtectedRoute>
          } />
          <Route path="/masters/add-unit-size" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <AddPropertySize />
            </ProtectedRoute>
          } />
          <Route path="/masters/stock" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <Stock />
            </ProtectedRoute>
          } />
          <Route path="/masters/add-broker" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <Broker />
            </ProtectedRoute>
          } />
          <Route path="/masters/add-customer" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <CustomerRegistration />
            </ProtectedRoute>
          } />
          <Route path="/masters/edit-customer" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <CustomerEdit />
            </ProtectedRoute>
          } />
          <Route path="/masters/add-co-applicant" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <AddCoApplicant />
            </ProtectedRoute>
          } />
          <Route path="/masters/add-bank" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <LeanBank />
            </ProtectedRoute>
          } />

          {/* Transaction Routes */}
          <Route path="/transaction/booking" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <Booking />
            </ProtectedRoute>
          } />
          <Route path="/transaction/payment" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <MoneyReceipt />
            </ProtectedRoute>
          } />
          <Route path="/transaction/transfer-charges" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <TransferCharges />
            </ProtectedRoute>
          } />
          <Route path="/transaction/allotment" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <UnitNoAllotment />
            </ProtectedRoute>
          } />
          <Route path="/transaction/feedback" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <CallingFeedback />
            </ProtectedRoute>
          } />
           <Route path="/transaction/BBA" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <BBAForm/>
            </ProtectedRoute>
          } />
           <Route path="/transaction/despatch" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <DespatchForm/>
            </ProtectedRoute>
          } />
          

          {/* Utilities Routes */}
          <Route path="/utilities/manage-employees" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Employees />
            </ProtectedRoute>
          } />
          <Route path="/utilities/allotment-letter" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <AllotmentLetter />
            </ProtectedRoute>
          } />
          <Route path="/utilities/log-reports" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <LogReports />
            </ProtectedRoute>
          } />
          <Route path="/utilities/upcoming-birthdays" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLOYEE']}>
              <UpcomingBirthdays />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ProjectUnitProvider>
  );
}

export default App;
