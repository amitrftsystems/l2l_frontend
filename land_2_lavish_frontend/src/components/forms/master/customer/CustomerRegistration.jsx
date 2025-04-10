import { useState, useEffect } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

const CustomerRegistration = () => {
  const [formData, setFormData] = useState({
    ProjectId: "",
    ProjectName: "",
    ManualApplicationNumber: "",
    BookingReceiptNumber: "",
    Name: "",
    FatherName: "",
    GrandFatherName: "",
    AlloteesDob: "",
    PermanentAddress: "",
    MailingAddress1: "",
    MailingAddress2: "",
    City: "",
    State: "",
    Pincode: "",
    Country: "India",
    Email: "",
    Phone: "",
    Fax: "",
    StdIsdCode: "",
    IncomeTaxWardNo: "",
    DisttNo: "",
    PanNo: "",
    AadharNo: "",
    Gstin: "",
    AgentName: "",
    AgentId: "",
    NomineeName: "",
    NomineeAddress: "",
    Paid100Percent: false,
  });

  const [projects, setProjects] = useState([]);
  const [allBrokers, setAllBrokers] = useState([]);
  const [projectBrokers, setProjectBrokers] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const [showProjectSuggestions, setShowProjectSuggestions] = useState(false);
  const [showAgentSuggestions, setShowAgentSuggestions] = useState(false);
  const [loading, setLoading] = useState({ projects: true, brokers: true });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const [projectsResponse, brokersResponse] = await Promise.all([
          fetch(
            "http://localhost:5000/api/master/get-projects",
            {
              signal: controller.signal,
            }
          ),
          fetch(
            "http://localhost:5000/api/master/get-brokers",
            {
              signal: controller.signal,
            }
          ),
        ]);

        clearTimeout(timeoutId);

        if (!projectsResponse.ok)
          throw new Error(
            `Projects fetch failed with status ${projectsResponse.status}`
          );
        if (!brokersResponse.ok)
          throw new Error(
            `Brokers fetch failed with status ${brokersResponse.status}`
          );

        const projectsData = await projectsResponse.json();
        const brokersData = await brokersResponse.json();

        if (!projectsData.success)
          throw new Error(projectsData.message || "Failed to load projects");
        if (!brokersData.success)
          throw new Error(brokersData.message || "Failed to load brokers");

        setProjects(projectsData.data || []);
        setAllBrokers(brokersData.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setErrors((prev) => ({
          ...prev,
          fetch:
            error.name === "AbortError"
              ? "Request timed out. Please try again."
              : error.message || "Failed to load initial data",
        }));
      } finally {
        setLoading({ projects: false, brokers: false });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formData.ProjectId) {
      const brokersForProject = allBrokers.filter(
        (broker) => broker.project_id === formData.ProjectId
      );
      setProjectBrokers(brokersForProject);
      setFormData((prev) => ({
        ...prev,
        AgentId: "",
        AgentName: "",
      }));
    } else {
      setProjectBrokers([]);
    }
  }, [formData.ProjectId, allBrokers]);

  const handleProjectNameChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      ProjectName: value,
      ProjectId: value === "" ? "" : prev.ProjectId,
    }));

    if (value.length > 1) {
      const filtered = projects.filter((project) =>
        project.project_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProjects(filtered);
      setShowProjectSuggestions(true);
    } else {
      setShowProjectSuggestions(false);
    }
  };

  const selectProject = (project) => {
    setFormData((prev) => ({
      ...prev,
      ProjectId: project.project_id,
      ProjectName: project.project_name,
    }));
    setShowProjectSuggestions(false);
    setProjectDropdownOpen(false);
  };

  const handleAgentNameChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      AgentName: value,
      AgentId: value === "" ? "" : prev.AgentId,
    }));

    if (value.length > 1) {
      const filtered = projectBrokers.filter((broker) =>
        broker.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBrokers(filtered);
      setShowAgentSuggestions(true);
    } else {
      setShowAgentSuggestions(false);
    }
  };

  const selectAgent = (broker) => {
    setFormData((prev) => ({
      ...prev,
      AgentId: broker.broker_id,
      AgentName: broker.name,
    }));
    setShowAgentSuggestions(false);
    setAgentDropdownOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.ProjectId) newErrors.ProjectName = "Please select a project";
    if (!formData.ManualApplicationNumber)
      newErrors.ManualApplicationNumber = "Application number is required";
    if (!formData.Name) newErrors.Name = "Name is required";
    if (!formData.FatherName)
      newErrors.FatherName = "Father/Husband name is required";
    if (!formData.PermanentAddress)
      newErrors.PermanentAddress = "Permanent address is required";
    if (!formData.City) newErrors.City = "City is required";
    if (!formData.State) newErrors.State = "State is required";
    if (!formData.Pincode) newErrors.Pincode = "Pincode is required";
    if (!formData.Phone) newErrors.Phone = "Phone number is required";

    if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Invalid email format";
    }
    if (formData.Phone && !/^\d{10}$/.test(formData.Phone)) {
      newErrors.Phone = "Invalid phone number (10 digits required)";
    }
    if (formData.PanNo && formData.PanNo.length !== 10) {
      newErrors.PanNo = "PAN must be 10 characters";
    }
    if (formData.AadharNo && formData.AadharNo.length !== 12) {
      newErrors.AadharNo = "Aadhar must be 12 digits";
    }
    if (formData.Pincode && !/^\d{6}$/.test(formData.Pincode)) {
      newErrors.Pincode = "Invalid pincode (6 digits required)";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setSubmitting(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const fullPostalAddress = [
        formData.MailingAddress1,
        formData.MailingAddress2,
      ]
        .filter(Boolean)
        .join(", ");

      const payload = {
        customer_id: formData.ManualApplicationNumber,
        project_id: formData.ProjectId,
        broker_id: formData.AgentId || null,
        property_type: null,
        booking_receipt_no: formData.BookingReceiptNumber || null,
        name: formData.Name,
        father_husband_name: formData.FatherName || null,
        grandfather_name: formData.GrandFatherName || null,
        allottee_dob: formData.AlloteesDob || null,
        permanent_address: formData.PermanentAddress,
        full_postal_address: fullPostalAddress || null,
        city: formData.City,
        state: formData.State,
        pincode: formData.Pincode,
        country: formData.Country,
        email: formData.Email || null,
        mobile: formData.Phone,
        std_isd_code: formData.StdIsdCode || null,
        phone: null,
        fax: formData.Fax || null,
        income_tax_ward_no: formData.IncomeTaxWardNo || null,
        dist_no: formData.DisttNo || null,
        pan_no: formData.PanNo || null,
        aadhar_no: formData.AadharNo || null,
        gstin: formData.Gstin || null,
        paid_100_percent: formData.Paid100Percent,
        nominee_name: formData.NomineeName || null,
        nominee_address: formData.NomineeAddress || null,
      };

      const response = await fetch(
        "http://localhost:5000/api/master/add-customer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData);

        if (response.status === 409) {
          const conflictError = {
            name: 'ValidationError',
            message: 'Duplicate entry found',
            errors: {
              submit: 'This customer already exists. Please check the following fields: ' +
                (errorData.message || 'Email, Phone, PAN, Aadhar, or Customer ID might be duplicate')
            }
          };
          throw conflictError;
        }
        
        
        // Handle validation errors from backend
        if (errorData.errors) {
          const backendErrors = {};
          errorData.errors.forEach(err => {
            const fieldMap = {
              'mobile': 'Phone',
              'email': 'Email',
              'pan_no': 'PanNo',
              'aadhar_no': 'AadharNo',
              'customer_id': 'ManualApplicationNumber'
            };
            
            const fieldName = fieldMap[err.path] || err.path;
            backendErrors[fieldName] = err.message;
          });
          
          throw { 
            name: 'ValidationError',
            message: 'Validation failed',
            errors: backendErrors
          };
        }
        
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);

      if (error.name === 'ValidationError') {
        if (error.errors) {
          // Set the specific field errors from backend
          setErrors(error.errors);
        } else {
          // Handle case where errors object is undefined
          setErrors({
            submit: error.message || 'Validation failed. Please check your input.'
          });
        }
      } else {
        let errorMsg = "Registration failed. Please try again.";
        if (error.name === "AbortError") {
          errorMsg = "Request timed out. Please try again.";
        } else if (error.message) {
          errorMsg = error.message;
        }

        setErrors({ submit: errorMsg });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatLabel = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/(\d+)/g, " $1")
      .trim();
  };

  const requiredFields = [
    "Name",
    "ManualApplicationNumber",
    "FatherName",
    "PermanentAddress",
    "City",
    "State",
    "Pincode",
    "Phone",
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#272727] p-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-4xl bg-white p-6 md:p-10 rounded-2xl shadow-lg flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-center mb-0">
          Customer Registration
        </h2>
        <p className="text-s text-center text-[#272727] mb-4">
          Fields marked by <span className="text-red-500">*</span> are mandatory
        </p>

        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}

        {errors.fetch && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            {errors.fetch}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
          {/* Project Name Field */}
          <div className="relative">
            <label className="block text-lg font-medium mb-1">
              Project Name <span className="text-red-600">*</span>
              <div className="relative">
                <input
                  type="text"
                  name="ProjectName"
                  value={formData.ProjectName}
                  onChange={handleProjectNameChange}
                  onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                  className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.ProjectName
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-green-500"
                  }`}
                  placeholder="Select or type project name..."
                  autoComplete="off"
                  disabled={submitting || loading.projects}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                  disabled={submitting || loading.projects}
                >
                  {projectDropdownOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              {errors.ProjectName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.ProjectName}
                </p>
              )}
            </label>

            {(showProjectSuggestions || projectDropdownOpen) &&
              (filteredProjects.length > 0 || projects.length > 0) && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {(showProjectSuggestions ? filteredProjects : projects).map(
                    (project) => (
                      <li
                        key={project.project_id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectProject(project)}
                      >
                        {project.project_name}
                      </li>
                    )
                  )}
                </ul>
              )}
          </div>

          {/* Agent Name Field */}
          <div className="relative">
            <label className="block text-lg font-medium mb-1">
              Agent Name
              <div className="relative">
                <input
                  type="text"
                  name="AgentName"
                  value={formData.AgentName}
                  onChange={handleAgentNameChange}
                  onClick={() =>
                    formData.ProjectId &&
                    setAgentDropdownOpen(!agentDropdownOpen)
                  }
                  className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.AgentName
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-green-500"
                  } ${
                    !formData.ProjectId ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder={
                    formData.ProjectId
                      ? "Select or type agent name..."
                      : "First select a project"
                  }
                  autoComplete="off"
                  disabled={
                    submitting || loading.brokers || !formData.ProjectId
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() =>
                    formData.ProjectId &&
                    setAgentDropdownOpen(!agentDropdownOpen)
                  }
                  disabled={
                    submitting || loading.brokers || !formData.ProjectId
                  }
                >
                  {agentDropdownOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              {errors.AgentName && (
                <p className="mt-1 text-sm text-red-500">{errors.AgentName}</p>
              )}
              {!formData.ProjectId && (
                <p className="mt-1 text-sm text-gray-500">
                  Please select a project first
                </p>
              )}
            </label>

            {(showAgentSuggestions || agentDropdownOpen) &&
              formData.ProjectId &&
              (filteredBrokers.length > 0 || projectBrokers.length > 0) && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {(showAgentSuggestions
                    ? filteredBrokers
                    : projectBrokers
                  ).map((broker) => (
                    <li
                      key={broker.broker_id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectAgent(broker)}
                    >
                      {broker.name}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        </div>

        <input type="hidden" name="ProjectId" value={formData.ProjectId} />
        <input type="hidden" name="AgentId" value={formData.AgentId} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
          {Object.entries(formData)
            .filter(
              ([field]) =>
                !["ProjectName", "ProjectId", "AgentName", "AgentId"].includes(
                  field
                )
            )
            .map(([field, value]) => (
              <div key={field} className="mb-4">
                <label className="block text-lg font-medium mb-1">
                  {formatLabel(field)}
                  {requiredFields.includes(field) && (
                    <span className="text-red-600">*</span>
                  )}
                  {field === "Paid100Percent" ? (
                    <input
                      type="checkbox"
                      name={field}
                      checked={value}
                      onChange={handleChange}
                      className="ml-2 h-5 w-5"
                      disabled={submitting}
                    />
                  ) : (
                    <input
                      name={field}
                      type={field === "AlloteesDob" ? "date" : "text"}
                      value={value}
                      onChange={handleChange}
                      className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                        errors[field]
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-green-500"
                      }`}
                      placeholder={`Enter ${formatLabel(field).toLowerCase()}`}
                      disabled={submitting}
                    />
                  )}
                </label>
                {errors[field] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors[field]}
                    {field === 'Email' && errors[field].includes('exists') && (
                      <span className="block text-xs">This email is already registered.</span>
                    )}
                    {field === 'Phone' && errors[field].includes('exists') && (
                      <span className="block text-xs">This phone number is already registered.</span>
                    )}
                    {field === 'PanNo' && errors[field].includes('exists') && (
                      <span className="block text-xs">This PAN is already registered.</span>
                    )}
                    {field === 'ManualApplicationNumber' && errors[field].includes('exists') && (
                      <span className="block text-xs">This application number is already used.</span>
                    )}
                  </p>
                )}
              </div>
            ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className={`w-full md:w-1/3 p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={submitting || loading.projects || loading.brokers}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-green-500 h-12 w-12" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600 mb-6">
              Customer registration completed successfully.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full animate-progress"
                style={{ animationDuration: "3s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRegistration;