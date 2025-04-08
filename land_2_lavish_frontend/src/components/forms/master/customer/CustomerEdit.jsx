import { useState, useEffect } from "react";

export default function EditRegistrationForm({ initialData }) {
  const [formData, setFormData] = useState({
    unitId: "",
    projectId: "",
    custId: "",
    backUp: "",
    buyBackCancel: "",
    buyBackCancelNote: "",
    HL: false,
    buyBackCancelDate: "",
    name: "",
    fatherHusbandName: "",
    grandFatherName: "",
    paymentPlan: "",
    basicRate: "",
    upfrontRate: "",
    propertyId: "",
    bookedSize: "",
    actualSize: "",
    stampDuty: "",
    increaseAreaRate: "",
    edcRate: "",
    propertyDescription: "",
    panNo: "",
    aadharNo: "",
    gstin: "",
    phoneNo: "",
    faxNo: "",
    mobileNo: "",
    emailId: "",
    constructionArea: "",
    constructionRate: "",
    manualApplicationNo: "",
    allocateParking: "",
    recordChangeDate: "",
    bankBranch: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/master/customer/:cusotmer_id/${formData.customer_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      alert("Form updated successfully!");
    } else {
      alert("Failed to update form.");
    }
  };

  return (
    <div className="min-h-screen bg-[#272727] flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-1">
          Edit Registration Form
        </h1>
        <p className="text-s text-center text-[#272727] mb-4">
          Fields marked by <span className="text-red-500">*</span> are mandatory
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-y-0 gap-x-6">
            {Object.keys(formData).map((field) =>
              field === "HL" ? (
                <div key={field} className="flex flex-col mb-4">
                  <label className="block mb-1 capitalize text-black font-medium">
                    HL
                  </label>
                  <div className="flex items-center">
                    <input
                      name={field}
                      type="checkbox"
                      className="w-6 h-6 mr-2 accent-green-500"
                      checked={formData[field]}
                      onChange={handleChange}
                      data-testid={`${field}-input`}
                    />
                    <span className="text-gray-500 text-sm">
                      Check the box to include HL Group
                    </span>
                  </div>
                </div>
              ) : (
                <div key={field} className="flex flex-col mb-4">
                  <label className="block mb-1 capitalize text-black font-medium">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    name={field}
                    className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    value={formData[field]}
                    onChange={handleChange}
                    type={field.includes("Date") ? "date" : "text"}
                    data-testid={`${field}-input`}
                  />
                </div>
              )
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
              data-testid="submit-button"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
