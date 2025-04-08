import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMastersOpen, setIsMastersOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);

  const mastersRef = useRef(null);
  const transactionRef = useRef(null);
  const reportsRef = useRef(null);
  const utilitiesRef = useRef(null);

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

  return (
    <nav className="bg-[#272727] p-4 shadow-lg z-50 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={"/"}>
          <button className="text-white text-xl font-semibold focus:outline-none">
            Back
          </button>
        </Link>
        <ul className="flex space-x-20">
          <li className="relative" ref={mastersRef}>
            <button
              onClick={() => {
                setIsMastersOpen(!isMastersOpen);
                setIsTransactionOpen(false); // Close other dropdown
                setIsReportsOpen(false);
                setIsUtilitiesOpen(false);
              }}
              className="text-white text-lg hover:text-gray-400"
            >
              Reg. Manual
            </button>
          </li>
          <li className="relative" ref={transactionRef}>
            <button
              onClick={() => {
                setIsTransactionOpen(!isTransactionOpen);
                setIsMastersOpen(false); // Close other dropdown
                setIsReportsOpen(false);
                setIsUtilitiesOpen(false);
              }}
              className="text-white text-lg hover:text-gray-400"
            >
              Today's Collection
            </button>
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
              Customer Details
            </button>
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
              Home
            </button>
          </li>
          <li className="relative" ref={mastersRef}>
            <button
              onClick={() => {
                setIsMastersOpen(!isMastersOpen);
                setIsTransactionOpen(false); // Close other dropdown
                setIsReportsOpen(false);
                setIsUtilitiesOpen(false);
              }}
              className="text-white text-lg hover:text-gray-400"
            >
              Search
            </button>
          </li>
          <li className="relative" ref={mastersRef}>
            <button
              onClick={() => {
                setIsMastersOpen(!isMastersOpen);
                setIsTransactionOpen(false); // Close other dropdown
                setIsReportsOpen(false);
                setIsUtilitiesOpen(false);
              }}
              className="text-white text-lg hover:text-gray-400"
            >
              Cust. Integration
            </button>
          </li>
          <li className="relative" ref={mastersRef}>
            <button
              onClick={() => {
                setIsMastersOpen(!isMastersOpen);
                setIsTransactionOpen(false); // Close other dropdown
                setIsReportsOpen(false);
                setIsUtilitiesOpen(false);
              }}
              className="text-white text-lg hover:text-gray-400"
            >
              Reg. Sys
            </button>
          </li>
        </ul>
        <a
          href="#logout"
          className="text-white text-xl font-semibold hover:text-red-400"
        >
          Logout
        </a>
      </div>
    </nav>
  );
}
