import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CoApplicant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_id: "",
    project_id: "",
    project_name: "",
    is_applicant: null,
    name: "",
    guardian_relation: "",
    guardian_name: "",
    address: "",
    mobile: "",
    email: "",
    phone: "",
    fax: "",
    occupation: "",
    income_tax_ward_no: "",
    dist_no: "",
    pan_no: "",
    dob: "",
    doa: "",
    nationality: "Resident India",
    custom_nationality: ""
  });

  const [customerOptions, setCustomerOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [loading, setLoading] = useState({ 
    customers: true, 
    projects: true,
    submit: false 
  });
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errors, setErrors] = useState({
    is_applicant: false,
    project_id: false,
    customer_id: false,
    name: false,
    address: false,
    phone: false,
    mobile: false,
    pan_no: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, customers: true, projects: true }));
        
        // Fetch customers
        const customersResponse = await axios.get(
          "http://localhost:5000/api/master/get-customers"
        );
        setCustomerOptions(customersResponse.data.data);

        // Fetch projects
        const projectsResponse = await axios.get(
          "http://localhost:5000/api/master/get-projects"
        );
        setProjectOptions(projectsResponse.data.data);

      } catch (err) {
        setError("Failed to load data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(prev => ({ ...prev, customers: false, projects: false }));
      }
    };
    fetchData();
  }, []);

  const handleProjectIdChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      project_id: value,
      project_name: "",
      customer_id: "" 
    }));
    setError("");
    setErrors(prev => ({ ...prev, project_id: false, customer_id: false }));

    if (value.length > 0) {
      const filtered = projectOptions.filter(project =>
        project.project_name.toLowerCase().includes(value.toLowerCase()) ||
        project.project_id.toString().includes(value)
      );
      setFilteredProjects(filtered);
      setShowProjectDropdown(true);
    } else {
      setShowProjectDropdown(false);
    }
  };

  const handleCustomerIdChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      customer_id: value,
    }));
    setError("");
    setErrors(prev => ({ ...prev, customer_id: false }));

    if (value.length > 0) {
      let filtered = customerOptions.filter(customer =>
        customer.customer_id.toString().includes(value)
      );

      if (formData.project_id) {
        filtered = filtered.filter(customer => 
          customer.project_id === formData.project_id
        );
      }

      setFilteredCustomers(filtered);
      setShowCustomerDropdown(true);
    } else {
      setShowCustomerDropdown(false);
    }
  };

  const selectProject = (project) => {
    setFormData(prev => ({ 
      ...prev, 
      project_id: project.project_id,
      project_name: project.project_name,
      customer_id: ""
    }));
    setShowProjectDropdown(false);
    setErrors(prev => ({ ...prev, project_id: false }));
    setFilteredCustomers([]);
  };

  const selectCustomer = (customer) => {
    setFormData(prev => ({ 
      ...prev, 
      customer_id: customer.customer_id,
      project_id: customer.project_id,
      project_name: projectOptions.find(p => p.project_id === customer.project_id)?.project_name || ""
    }));
    setShowCustomerDropdown(false);
    setErrors(prev => ({ ...prev, customer_id: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone' || name === 'mobile') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prevData => ({
        ...prevData,
        [name]: digitsOnly.slice(0, 10), // Limit to 10 digits
      }));
      
      // Validate phone/mobile number length
      if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
        setErrors(prev => ({ ...prev, [name]: true }));
      } else {
        setErrors(prev => ({ ...prev, [name]: false }));
      }
    } else if (name === 'pan_no') {
      const uppercaseValue = value.toUpperCase();
      setFormData(prevData => ({
        ...prevData,
        [name]: uppercaseValue,
      }));
      
      // Validate PAN format (5 letters, 4 digits, 1 letter)
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (uppercaseValue.length > 0 && !panRegex.test(uppercaseValue)) {
        setErrors(prev => ({ ...prev, pan_no: true }));
      } else {
        setErrors(prev => ({ ...prev, pan_no: false }));
      }
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
    
    if (errors[name] && name !== 'phone' && name !== 'mobile' && name !== 'pan_no') {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      is_applicant: false,
      project_id: false,
      customer_id: false,
      name: false,
      address: false,
      phone: false,
      mobile: false,
      pan_no: false
    };

    if (formData.is_applicant === null) {
      newErrors.is_applicant = true;
      valid = false;
    }

    if (!formData.project_id) {
      newErrors.project_id = true;
      valid = false;
    }

    if (!formData.customer_id) {
      newErrors.customer_id = true;
      valid = false;
    }

    if (!formData.name) {
      newErrors.name = true;
      valid = false;
    }

    if (!formData.address) {
      newErrors.address = true;
      valid = false;
    }

    // Validate phone numbers if they have values
    if (formData.phone && formData.phone.length !== 10) {
      newErrors.phone = true;
      valid = false;
    }

    if (formData.mobile && formData.mobile.length !== 10) {
      newErrors.mobile = true;
      valid = false;
    }

    // Validate PAN if it has value
    if (formData.pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_no)) {
      newErrors.pan_no = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submit: true }));
      
      const submissionData = {
        customer_id: formData.customer_id,
        is_applicant: formData.is_applicant,
        name: formData.name,
        guardian_name: formData.guardian_name || null,
        address: formData.address,
        mobile: formData.mobile || null,
        email: formData.email || null,
        phone: formData.phone || null,
        fax: formData.fax || null,
        occupation: formData.occupation || null,
        income_tax_ward_no: formData.income_tax_ward_no || null,
        dist_no: formData.dist_no || null,
        pan_no: formData.pan_no || null,
        dob: formData.dob || null,
        nationality: formData.nationality === "Non-Resident India" && formData.custom_nationality 
          ? formData.custom_nationality 
          : formData.nationality
      };

      await axios.post(
        "http://localhost:5000/api/master/co-applicant",
        submissionData
      );
      
      setShowSuccessPopup(true);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register co-applicant");
      console.error("Submission error:", err);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#272727] p-30">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center text-black mb-2">
          Co-Applicant Registration
        </h2>
        <p className="text-center text-sm text-red-500 mb-6">
          Fields marked by <span className="text-red-500">*</span> are mandatory
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center gap-6 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.is_applicant === true}
                onChange={() => setFormData(prev => ({ ...prev, is_applicant: true }))}
                className="h-4 w-4 text-blue-600 focus:ring-green-500"
                disabled={loading.submit}
              />
              <span className="text-gray-700">Applicant</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={formData.is_applicant === false}
                onChange={() => setFormData(prev => ({ ...prev, is_applicant: false }))}
                className="h-4 w-4 text-blue-600 focus:ring-green-500"
                disabled={loading.submit}
              />
              <span className="text-gray-700">Co-Applicant</span>
            </label>
          </div>
          {errors.is_applicant && (
            <p className="text-red-500 text-sm text-center -mt-3">Please select either Applicant or Co-Applicant</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="project_id"
                  value={formData.project_name || formData.project_id}
                  onChange={handleProjectIdChange}
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
                    errors.project_id ? 'border-red-500 focus:ring-red-500' : 'border-black-300 focus:ring-green-500'
                  } ${loading.projects ? 'bg-gray-100' : ''}`}
                  disabled={loading.projects || loading.submit}
                  placeholder="Search by Project Name or ID"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                  disabled={loading.projects || loading.submit}
                >
                  {showProjectDropdown ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              {showProjectDropdown && (filteredProjects.length > 0 || projectOptions.length > 0) && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {(filteredProjects.length > 0 ? filteredProjects : projectOptions).map(project => (
                    <li
                      key={project.project_id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectProject(project)}
                    >
                      <div className="font-medium">{project.project_name}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            

            <div className="relative">
              <label className="block font-medium text-gray-700 mb-1">
                Customer ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleCustomerIdChange}
                  onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
                    errors.customer_id ? 'border-red-500 focus:ring-red-500' : 'border-black-300 focus:ring-green-500'
                  } ${loading.customers ? 'bg-gray-100' : ''}`}
                  disabled={loading.customers || loading.submit}
                  placeholder="Search by Customer ID"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                  disabled={loading.customers || loading.submit}
                >
                  {showCustomerDropdown ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              {showCustomerDropdown && (filteredCustomers.length > 0 || customerOptions.length > 0) && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {(filteredCustomers.length > 0 ? filteredCustomers : customerOptions)
                    .filter(customer => 
                      !formData.project_id || customer.project_id === formData.project_id
                    )
                    .map(customer => (
                      <li
                        key={customer.customer_id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectCustomer(customer)}
                      >
                        <div className="font-medium">ID: {customer.customer_id}</div>
                        <div className="text-sm text-gray-600">Project: {projectOptions.find(p => p.project_id === customer.project_id)?.project_name || customer.project_id}</div>
                      </li>
                    ))
                  }
                </ul>
              )}
              {errors.customer_id && (
                <p className="text-red-500 text-xs mt-1">Customer ID is required</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-black-300 focus:ring-green-500'
                }`}
                required
                disabled={loading.submit}
                maxLength={255}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">Full Name is required</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Guardian Relation
              </label>
              <select
                name="guardian_relation"
                value={formData.guardian_relation}
                onChange={handleChange}
                className="w-full p-2 border border-black-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                disabled={loading.submit}
              >
                <option value="">Select Relation</option>
                <option value="S/O">Son of</option>
                <option value="W/O">Wife of</option>
                <option value="D/O">Daughter of</option>
                <option value="O">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Guardian Name
              </label>
              <input
                type="text"
                name="guardian_name"
                value={formData.guardian_name}
                onChange={handleChange}
                className="w-full p-2 border border-black-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                disabled={loading.submit}
                maxLength={50}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
                  errors.address ? 'border-red-500 focus:ring-red-500' : 'border-black-300 focus:ring-green-500'
                }`}
                required
                disabled={loading.submit}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">Address is required</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Mobile
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
                  errors.mobile ? 'border-red-500 focus:ring-red-500' : 'border-black-300 focus:ring-green-500'
                }`}
                disabled={loading.submit}
                maxLength={10}
                placeholder="10 digit number"
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">Mobile number must be 10 digits</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-black-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                disabled={loading.submit}
                maxLength={255}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
                  errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-black-300 focus:ring-green-500'
                }`}
                disabled={loading.submit}
                maxLength={10}
                placeholder="10 digit number"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">Phone number must be 10 digits</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Fax
              </label>
              <input
                type="text"
                name="fax"
                value={formData.fax}
                onChange={handleChange}
                className="w-full p-2 border border-black-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                disabled={loading.submit}
                maxLength={15}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full p-2 border border-black-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                disabled={loading.submit}
                maxLength={255}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Income Tax Ward No.
              </label>
              <input
                type="text"
                name="income_tax_ward_no"
                value={formData.income_tax_ward_no}
                onChange={handleChange}
                className="w-full p-2 border border-black-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                disabled={loading.submit}
                maxLength={50}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Distt No.
              </label>
              <input
                type="text"
                name="dist_no"
                value={formData.dist_no}
                onChange={handleChange}
                className="w-full p-2 border border-black-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                disabled={loading.submit}
                maxLength={50}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                PAN No.
              </label>
              <input
                type="text"
                name="pan_no"
                value={formData.pan_no}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:outline-none ${
                  errors.pan_no ? 'border-red-500 focus:ring-red-500' : 'border-black-300 focus:ring-green-500'
                }`}
                disabled={loading.submit}
                maxLength={10}
                placeholder="ABCDE1234F"
              />
              {errors.pan_no && (
                <p className="text-red-500 text-xs mt-1">PAN must be in format: ABCDE1234F</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border border-black-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                disabled={loading.submit}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Date of Agreement
              </label>
              <input
                type="date"
                name="doa"
                value={formData.doa}
                onChange={handleChange}
                className="w-full p-2 border border-black-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                disabled={loading.submit}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Nationality
              </label>
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full p-2 border border-black-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                disabled={loading.submit}
              >
                <option value="Resident India">Resident Indian</option>
                <option value="Non-Resident India">Non-Resident Indian</option>
              </select>
              {formData.nationality === "Non-Resident India" && (
                <div className="mt-2">
                  <label className="block font-medium text-gray-700 mb-1">
                    Specify Nationality
                  </label>
                  <input
                    type="text"
                    name="custom_nationality"
                    value={formData.custom_nationality}
                    onChange={handleChange}
                    className="w-full p-2 border border-black-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                    disabled={loading.submit}
                    placeholder="Enter your nationality"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading.submit}
              className={`px-8 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors ${
                loading.submit ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading.submit ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Success!</h3>
                <div className="mt-2 text-sm text-gray-500">
                  Co-Applicant registered successfully!
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">You will be redirected shortly...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoApplicant;