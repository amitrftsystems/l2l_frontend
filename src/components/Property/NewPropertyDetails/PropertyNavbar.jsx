import React, { useState, useEffect } from "react";

const sections = [
  { label: "DETAIL", id: "detail" },
  { label: "GALLERY", id: "gallery" },
  { label: "AMENITIES", id: "amenities" },
  { label: "FLOOR PLANS", id: "floor-plans" },
  { label: "PAYMENT PLAN", id: "payment-plan" },
  { label: "BROCHURE", id: "brochure" },
  { label: "LOCATION", id: "location" },
];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const navbarTop = navbar ? navbar.offsetTop : 0;

    const handleScroll = () => {
      setIsFixed(window.scrollY >= navbarTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // Adjusting visibility sensitivity
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleScrollToSection = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      id="navbar"
      className={`bg-white shadow-md w-full transition-all duration-300 ${
        isFixed ? "fixed top-0 left-0 right-0 z-50" : "relative"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-0">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {sections.map(({ label, id }) => (
                  <button
                    key={id}
                    onClick={() => handleScrollToSection(id)}
                    className={`px-3 py-2 rounded-md text-lg font-medium focus:outline-none transition-all ${
                      activeSection === id
                        ? "text-orange-500 border-b-2 border-orange-500"
                        : "text-gray-800 hover:text-orange-500 hover:border-b-2 hover:border-orange-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
