import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import your step components
import PropertyType from "../components/Property/PropertyType";
import TellUsAboutProperty from "../components/Property/TellUsAboutProperty"
import AddPricingDetails from "../components/Property/Price";
import AddMedia from "../components/Property/AddMedia";
import FeaturesAmenities from "../components/Property/FeaturesAmenities";
import ContactInformation from "../components/Property/ContactInformation";
import AddLayouts from "../components/Property/AddLayouts";
import FinalReview from "../components/Property/FinalReview";

// Import HorizontalNav
import HorizontalNav from "../components/Property/HorizontalNav";

const ListingForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  // Determine if we're on mobile (sm breakpoint at 640px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const steps = [
    { id: 1, title: "Property Type", content: <PropertyType /> },
    {
      id: 2,
      title: "Tell Us About Property",
      content: <TellUsAboutProperty />,
    },
    { id: 3, title: "Features & Amenities", content: <FeaturesAmenities /> },
    { id: 4, title: "Upload Media", content: <AddMedia /> },
    { id: 5, title: "Pricing & Details", content: <AddPricingDetails /> },
    { id: 6, title: "Contact Information", content: <ContactInformation /> },
    { id: 7, title: "Uploading Layouts", content: <AddLayouts /> },
    { id: 8, title: "Final Review", content: <FinalReview /> },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Form Submitted", formData);
    alert("Property Listing Submitted!");
  };

  // Clone the current step component to pass formData and updateFormData as props
  const currentContent = React.cloneElement(steps[currentStep].content, {
    formData,
    updateFormData,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-24">
      <div className="w-full max-w-4xl mx-auto p-6">
        {isMobile ? (
          // On mobile, render content statically (no animation)
          <div>{currentContent}</div>
        ) : (
          // On larger screens, render with animation
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              {currentContent}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <HorizontalNav
        steps={steps}
        currentStep={currentStep}
        nextStep={nextStep}
        prevStep={prevStep}
        handleSubmit={handleSubmit}
        formData={formData}
        goToStep={(index) => setCurrentStep(index)} // Direct navigation prop
        // goToStep={(index) => setCurrentStep(index)}
      />
    </div>
  );
};

export default ListingForm;
