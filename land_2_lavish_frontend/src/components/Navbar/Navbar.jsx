import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isMastersOpen, setIsMastersOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const mastersRef = useRef(null);
  const transactionRef = useRef(null);
  const reportsRef = useRef(null);
  const utilitiesRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

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
        !utilitiesRef.current.contains(event.target)
      ) {
        setIsMastersOpen(false);
        setIsTransactionOpen(false);
        setIsReportsOpen(false);
        setIsUtilitiesOpen(false);
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
                  { name: "Broker", link: "/masters/add-broker" },
                  {
                    name: "Customer Registration",
                    subItems: [
                      {
                        name: "Add",
                        link: "/masters/add-customer",
                      },
                      {
                        name: "Edit",
                        link: "/masters/edit-customer",
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
                  { name: "Buyer Agreements", link: "#customer-registration" },
                  { name: "Unit Transfer (A to B)", link: "#broker" },
                  { name: "Buyer Agreements", link: "/bba" },
                  { name: "Calling Feedbacks", link: "/transaction/feedback" },
                  { name: "Cust. Correspondence", link: "#loan-bank" },
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
                  { name: "Log Report", link: "#stock" },
                  { name: "Upcoming Birthdays", link: "#broker" },
                ].map((item, index) => (
                  <li key={index} className="px-4 py-2 hover:bg-gray-700">
                    <a href={item.link}>{item.name}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="text-white text-xl font-semibold hover:text-red-400"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
