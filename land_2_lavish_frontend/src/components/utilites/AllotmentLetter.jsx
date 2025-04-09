import { useRef, useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import axios from "axios";
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function AllotmentLetter() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState({ project: '' });
    const [dropdownOpen, setDropdownOpen] = useState({ project: false });
    const [formData, setFormData] = useState({ projectId: '', propertyId: '' });
    const [formErrors, setFormErrors] = useState({ projectId: '', propertyId: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [propertyValidation, setPropertyValidation] = useState({ isValid: false, message: '' });

    const dropdownRefs = {
        project: useRef(null)
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/master/get-projects");
                if (response.data.success) {
                    setProjects(response.data.data);
                } else {
                    console.error("Failed to fetch projects:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    const filteredData = (data, term, nameKey, idKey) => {
        if (!term) return data;
        return data.filter(item =>
            item[nameKey].toLowerCase().includes(term.toLowerCase()) ||
            item[idKey].toString().includes(term)
        );
    };

    const getSelectedName = (data, id, nameKey, idKey) => {
        const selected = data.find(item => item[idKey] === id);
        return selected ? `${selected[nameKey]} (${selected[idKey]})` : '';
    };

    const handleSelect = (type, value) => {
        if (type === 'project') {
            setFormData(prev => ({ ...prev, projectId: value }));
            setSearchTerm(prev => ({ ...prev, project: '' }));
            setDropdownOpen(prev => ({ ...prev, [type]: false }));
            setFormErrors(prev => ({ ...prev, projectId: value ? '' : 'Please select a project' }));
        }
    };

    const validateProperty = async (propertyId) => {
        if (!propertyId) {
            setPropertyValidation({ isValid: false, message: 'Please enter a property ID' });
            return false;
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/master/property/${propertyId}`);
            if (response.data.success) {
                setPropertyValidation({ isValid: true, message: 'Property ID is valid' });
                return true;
            } else {
                setPropertyValidation({ isValid: false, message: 'Invalid property ID' });
                return false;
            }
        } catch (error) {
            console.error("Error validating property:", error);
            setPropertyValidation({ isValid: false, message: 'Error validating property ID' });
            return false;
        }
    };

    const handlePropertyChange = async (e) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, propertyId: value }));
        if (value) {
            await validateProperty(value);
        } else {
            setPropertyValidation({ isValid: false, message: 'Please enter a property ID' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = {};
        if (!formData.projectId) errors.projectId = 'Please select a project';
        if (!formData.propertyId) errors.propertyId = 'Please enter a property ID';
        
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const isPropertyValid = await validateProperty(formData.propertyId);
        if (!isPropertyValid) {
            setFormErrors(prev => ({ ...prev, propertyId: 'Invalid property ID' }));
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/submit-allotment', formData);
            alert('Submission successful: ' + JSON.stringify(response.data));
            setFormData({ projectId: '', propertyId: '' });
            setSearchTerm({ project: '' });
            setFormErrors({});
            setPropertyValidation({ isValid: false, message: '' });
        } catch (error) {
            alert('Submission failed: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    const navigate = useNavigate();


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRefs.project.current && 
                !dropdownRefs.project.current.contains(event.target)) {
                setDropdownOpen({ project: false });
            }
        };
        if (dropdownOpen.project) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen.project]);

    return (
        <>
      <AppBar position="static" sx={{ bgcolor: '#272727' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/admin')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Allotment Letter
          </Typography>
        </Toolbar>
      </AppBar>
      
        <form onSubmit={handleSubmit} className="p-4 max-w-2xl mx-auto">
            <div className="p-4 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Allotment Letter</h1>
                
                {/* Project Dropdown */}
                <div className="relative mb-4" ref={dropdownRefs.project}>
                    <label className="block text-gray-700 font-medium mb-1">
                        Project<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            value={formData.projectId ? getSelectedName(projects, parseInt(formData.projectId), "project_name", "project_id") : searchTerm.project}
                            onChange={e => setSearchTerm(p => ({ ...p, project: e.target.value }))}
                            onClick={() => setDropdownOpen(p => ({ ...p, project: true }))}
                            readOnly={!!formData.projectId}
                            className={`w-full p-2 border rounded-md focus:outline-none ${
                                formErrors.projectId ? "border-red-500 focus:ring-2 focus:ring-red-500" : 
                                "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                            }`}
                            placeholder="Search project..."
                        />
                        {formData.projectId && (
                            <X
                                className="absolute right-10 top-3 cursor-pointer text-gray-400 hover:text-red-500"
                                onClick={() => handleSelect("project", "")}
                            />
                        )}
                        <ChevronDown className="absolute right-3 top-3 text-gray-400" />
                    </div>
                    {formErrors.projectId && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.projectId}</p>
                    )}
                    {dropdownOpen.project && (
                        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                            {filteredData(projects, searchTerm.project, "project_name", "project_id").map(p => (
                                <div
                                    key={p.project_id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                                    onClick={() => handleSelect("project", p.project_id)}
                                >
                                    {p.project_name} ({p.project_id})
                                </div>
                            ))}
                            {filteredData(projects, searchTerm.project, "project_name", "project_id").length === 0 && (
                                <div className="p-2 text-gray-500">No projects found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Property ID Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
                        Property ID<span className="text-red-500">*</span>
                    </label>
                    <input
                        value={formData.propertyId}
                        onChange={handlePropertyChange}
                        onBlur={() => {
                            if (!formData.propertyId) {
                                setFormErrors(prev => ({ ...prev, propertyId: 'Please enter a property ID' }));
                            }
                        }}
                        className={`w-full p-2 border rounded-md focus:outline-none ${
                            formErrors.propertyId ? "border-red-500 focus:ring-2 focus:ring-red-500" : 
                            propertyValidation.isValid ? "border-green-500 focus:ring-2 focus:ring-green-500" :
                            "border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                        }`}
                        placeholder="Enter property ID"
                    />
                    {formErrors.propertyId && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.propertyId}</p>
                    )}
                    {propertyValidation.message && !formErrors.propertyId && (
                        <p className={`text-sm mt-1 ${propertyValidation.isValid ? 'text-green-500' : 'text-red-500'}`}>
                            {propertyValidation.message}
                        </p>
                    )}
                </div>
                <div className="mt-6">
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors
                            ${isSubmitting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Generate Allotment Letter'}
                    </button>
                </div>
            </div>
        </form>
        </>
    );
}