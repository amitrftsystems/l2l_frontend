import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";


export default function Navbar() {
  const [isMastersOpen, setIsMastersOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    retypePassword: '',
  });
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const mastersRef = useRef(null);
  const transactionRef = useRef(null);
  const reportsRef = useRef(null);
  const utilitiesRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle back button click for /masters routes
  useEffect(() => {
    const handleBackButton = () => {
      if (location.pathname.includes("/masters")) {
        navigate("/HomePage"); // Redirect to HomePage
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [location, navigate]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mastersRef.current &&
        !mastersRef.current.contains(event.target) &&
        transactionRef.current &&
        !transactionRef.current.contains(event.target) &&
        reportsRef.current &&
        !reportsRef.current.contains(event.target) &&
        utilitiesRef.current &&
        !utilitiesRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsMastersOpen(false);
        setIsTransactionOpen(false);
        setIsReportsOpen(false);
        setIsUtilitiesOpen(false);
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMastersDropdownClick = (itemLink) => {
    navigate(itemLink); // Navigate to the page
    setIsMastersOpen(false); // Close the dropdown after navigation
  };

  const handleTransactionClick = (itemLink) => {
    navigate(itemLink); // Navigate to the page
    setIsMastersOpen(false); // Close the dropdown after navigation
  };

  const toggleSubMenu = (itemName) => {
    // Toggle the sub-menu for the clicked item
    setOpenSubMenu(openSubMenu === itemName ? null : itemName);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleResetPassword = async () => {
    setResetPasswordError('');
    if (!resetPasswordData.oldPassword || !resetPasswordData.newPassword || !resetPasswordData.retypePassword) {
      setResetPasswordError('All fields are required');
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.retypePassword) {
      setResetPasswordError('New passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(resetPasswordData.newPassword)) {
      setResetPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/users/reset-password/${user.id}`,
        resetPasswordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResetPasswordOpen(false);
      setResetPasswordData({
        oldPassword: '',
        newPassword: '',
        retypePassword: '',
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      setResetPasswordError(error.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <nav className="bg-[#272727] p-4 shadow-lg z-50 relative">
      <div className="container mx-auto flex justify-between items-center">
        <button className="text-white text-xl font-semibold focus:outline-none">
          HL Group
        </button>
        <ul className="flex space-x-30">
          <li className="relative" ref={mastersRef}>
            <button
              onClick={() => {
                setIsMastersOpen(!isMastersOpen);
                setIsReportsOpen(false);
                setIsTransactionOpen(false);
                setIsUtilitiesOpen(false);
              }}
              className="text-white text-lg hover:text-gray-400"
            >
              Masters
            </button>
            {isMastersOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-[#272727] text-white rounded-lg shadow-lg">
                {[
                  { name: "Plans", link: "/masters/add-new-plan" },
                  { name: "Projects/Locations", link: "/masters/add-project" },
                  { name: "PLC", link: "/masters/add-new-plc" },
                  { name: "Unit Size", link: "/masters/add-unit-size" },
                  { name: "Stock", link: "/masters/stock" },
                  { name: "Broker", link: "/masters/broker-list" },
                  {
                    name: "Customer Registration",
                    subItems: [
                      {
                        name: "Add",
                        link: "/masters/add-customer",
                      },
        
                    ],
                  },
                  { name: "Co-Applicant", link: "/masters/add-co-applicant" },
                  { name: "Lean Bank", link: "/masters/add-bank" },
                ].map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-700 relative"
                  >
                    {item.subItems ? (
                      <>
                        <button
                          onClick={() => toggleSubMenu(item.name)}
                          className="block w-full text-left"
                        >
                          {item.name}
                        </button>
                        {openSubMenu === item.name && (
                          <ul className="absolute left-48 top-0 w-48 bg-[#272727] text-white rounded-lg shadow-lg">
                            {item.subItems.map((subItem, subIndex) => (
                              <li
                                key={subIndex}
                                className="px-4 py-2 hover:bg-gray-700"
                                onClick={() =>
                                  handleMastersDropdownClick(subItem.link)
                                }
                              >
                                {subItem.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <span
                        className="block"
                        onClick={() => handleMastersDropdownClick(item.link)}
                      >
                        {item.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="relative" ref={transactionRef}>
            <button
              onClick={() => {
                setIsMastersOpen(false);
                setIsReportsOpen(false);
                setIsTransactionOpen(!isTransactionOpen);
                setIsUtilitiesOpen(false);
              }}
              className="text-white text-lg hover:text-gray-400"
            >
              Transaction
            </button>
            {isTransactionOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-[#272727] text-white rounded-lg shadow-lg">
                {[
                  { name: "Booking", link: "/transaction/booking" },
                  { name: "Money Receipt", link: "/transaction/payment" },
                  {
                    name: "Unit No. Allotment",
                    link: "/transaction/allotment",
                  },
                  { name: "Cheques Deposited (Bank)", link: "#unit-size" },
                  { name: "Credit Payments", link: "#stock" },
                  {
                    name: "Unit Transfer (A to B)",
                    link: "/transaction/transfer-charges",
                  },
                  { name: "Buyer Agreements", link: "/transaction/BBA" },
                  { name: "Calling Feedbacks", link: "/transaction/feedback" },
                  { name: "Cust. Correspondence", link: "/transaction/despatch" },
                ].map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-700"
                    onClick={() => handleTransactionClick(item.link)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="relative" ref={reportsRef}>
            <button
              onClick={() => {
                setIsReportsOpen(!isReportsOpen);
                setIsMastersOpen(false);
                setIsTransactionOpen(false);
                setIsUtilitiesOpen(false);
              }}
              className="text-white text-lg hover:text-gray-400"
            >
              Reports
            </button>
            {isReportsOpen && (
              <ul className="absolute left-0 mt-2 w-78 bg-[#272727] text-white rounded-lg shadow-lg">
                {[
                  { name: "Project Details", link: "#plans" },
                  { name: "Collection", link: "#projects" },
                  { name: "List of Customer Project wise", link: "#plc" },
                  {
                    name: "List of Customer Project wise (Fin. Year)",
                    link: "#unit-size",
                  },
                  { name: "Collection Details", link: "#stock" },
                  { name: "Master Reports", link: "#broker" },
                  {
                    name: "Buyer Agreements",
                    link: "#customer-registration",
                  },
                  { name: "Calling Details Between", link: "#co-applicant" },
                  { name: "Cust. Correspondence-", link: "#loan-bank" },
                  { name: "Unit Transfers", link: "#loan-branch" },
                  { name: "Stock", link: "#loan-branch" },
                  { name: "Outstanding Report", link: "#loan-branch" },
                  { name: "BBA Status", link: "#loan-branch" },
                  { name: "Buy Back/Cancel Cases", link: "#loan-branch" },
                  { name: "Dues FinYrs -", link: "#loan-branch" },
                ].map((item, index) => (
                  <li key={index} className="px-4 py-2 hover:bg-gray-700">
                    <a href={item.link}>{item.name}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="relative" ref={utilitiesRef}>
            <button
              onClick={() => {
                setIsUtilitiesOpen(!isUtilitiesOpen);
                setIsMastersOpen(false);
                setIsTransactionOpen(false);
                setIsReportsOpen(false);
              }}
              className="text-white text-lg hover:text-gray-400"
            >
              Utilities
            </button>
            {isUtilitiesOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-[#272727] text-white rounded-lg shadow-lg">
                {[
                  { name: "Manage Employees", link: "/utilities/manage-employees" },
                  { name: "Add New Property", link: "/List-your-property" },
                  { name: "Allotment Letter", link: "/utilities/allotment-letter" },
                  { name: "Customer Care", link: "#unit-size" },
                  { name: "Log Reports", link: "/utilities/log-reports" },
                  { name: "Upcoming Birthdays", link: "/utilities/upcoming-birthdays" },
                ].map((item, index) => (
                  <li key={index} className="px-4 py-2 hover:bg-gray-700">
                    <a href={item.link}>{item.name}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 text-white hover:text-gray-300"
          >
            <AccountCircle className="text-3xl" />
            <span>{user?.name || 'User'}</span>
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <button
                onClick={() => {
                  setResetPasswordOpen(true);
                  setIsProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Reset Password
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reset Password Dialog */}
      {resetPasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            {resetPasswordError && (
              <p className="text-red-500 text-sm mb-4">{resetPasswordError}</p>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Old Password</label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={resetPasswordData.oldPassword}
                    onChange={(e) => setResetPasswordData({ ...resetPasswordData, oldPassword: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter Old Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
                <label className="block text-sm font-medium text-gray-700 mt-4">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={resetPasswordData.newPassword}
                    onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter New Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Retype New Password</label>
                <div className="relative">
                  <input
                    type={showRetypePassword ? "text" : "password"}
                    value={resetPasswordData.retypePassword}
                    onChange={(e) => setResetPasswordData({ ...resetPasswordData, retypePassword: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Retype New Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowRetypePassword(!showRetypePassword)}
                  >
                    {showRetypePassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setResetPasswordOpen(false);
                  setResetPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    retypePassword: '',
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
