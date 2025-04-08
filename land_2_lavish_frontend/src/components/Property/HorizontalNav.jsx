import PropTypes from 'prop-types';
import NavButton from "./NavButton";

const HorizontalNav = ({
  steps,
  currentStep,
  nextStep,
  prevStep,
  goToStep, 
  formData,
}) => {
  const totalSteps = steps.length - 1;
  const progress = (currentStep / totalSteps) * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Format the form data to match backend expectations
      const formattedData = {
        property_id: parseInt(formData.property_id),
        property_type: formData.property_type,
        size: parseInt(formData.size),
        customer_id: formData.customer_id ? parseInt(formData.customer_id) : null,
        allotment_date: formData.allotment_date || null,
        remark: formData.remark || null
      };

      // Validate required fields
      if (!formattedData.property_id || !formattedData.property_type || isNaN(formattedData.size)) {
        throw new Error("Property ID, type, and size are required fields");
      }

      const response = await fetch("http://localhost:5000/api/master/property", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Property added successfully:", result);
      alert("Property added successfully!");
    } catch (error) {
      console.error("Error submitting property:", error.message);
      alert(error.message || "Failed to add property");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white">
      <div className="p-5 flex flex-col items-center">
        {/* Progress bar with transition only on sm and up */}
        <div className="relative w-full h-2 bg-gray-200 mb-2">
          <div
            style={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-2 bg-black sm:transition-all"
          />
        </div>

        {/* Navigation Row */}
        <div className="flex items-center justify-between w-full px-2">
          <NavButton
            onClick={prevStep}
            disabled={currentStep === 0}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1"
          >
            Previous
          </NavButton>

          {/* Step Circles + Titles (only shown on sm and larger) */}
          <div className="hidden sm:flex items-center space-x-6">
            {steps.map((step, index) => {
              const isCurrentOrCompleted = index <= currentStep;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => goToStep && goToStep(index)}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                      isCurrentOrCompleted
                        ? "bg-black text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-1 whitespace-nowrap">
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {currentStep < totalSteps ? (
            <NavButton
              onClick={nextStep}
              className="bg-black hover:bg-gray-800 text-white px-3 py-1"
            >
              Next
            </NavButton>
          ) : (
            <NavButton
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1"
              formData={formData}
            >
              Submit
            </NavButton>
          )}
        </div>
      </div>
    </div>
  );
};

HorizontalNav.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  goToStep: PropTypes.func,
  formData: PropTypes.shape({
    property_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    property_type: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    customer_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    allotment_date: PropTypes.string,
    remark: PropTypes.string
  }).isRequired
};

export default HorizontalNav;
