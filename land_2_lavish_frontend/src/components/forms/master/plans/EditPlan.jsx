import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";

const EditPlan = () => {
  const { planName } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    fetchPlanDetails();
  }, [planName]);

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/master/get-installment-plan-by-name/${planName}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPlan(data.data);
        // Initialize table data with existing plan details
        const rows = data.data.installment_details.map(detail => {
          // Determine which amount field is active based on the initial values
          let amountFieldActive = null;
          if (detail.percentage && detail.percentage !== 0) {
            amountFieldActive = "percentage";
          } else if (detail.amount && detail.amount !== 0) {
            amountFieldActive = "lumpSum";
          }

          return {
            installment: detail.installment_number,
            dueAfterDays: detail.due_after_days?.toString() || "",
            dueDate: detail.due_date ? new Date(detail.due_date).toISOString().split('T')[0] : "",
            percentage: detail.percentage && detail.percentage !== 0 ? detail.percentage.toString() : "",
            lumpSum: detail.amount && detail.amount !== 0 ? detail.amount.toString() : "",
            remarks: detail.remarks || "",
            dueFieldActive: detail.due_after_days ? "dueAfterDays" : detail.due_date ? "dueDate" : null,
            amountFieldActive: amountFieldActive,
          };
        });
        setTableData({
          planName: data.data.plan_name,
          rows: rows
        });
      } else {
        throw new Error(data.message || "Failed to fetch plan details");
      }
    } catch (error) {
      console.error("Error fetching plan details:", error);
      setError("Failed to load plan details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...tableData.rows];
    const row = { ...updatedRows[index] };

    row[field] = value;

    if (field === "dueAfterDays" || field === "dueDate") {
      if (value === "") {
        row.dueFieldActive = null;
      } else if (!row.dueFieldActive) {
        row.dueFieldActive = field;
      }
    } else if (field === "percentage") {
      if (value === "" || value === "0") {
        row.amountFieldActive = null;
        row.percentage = "";
      } else {
        row.amountFieldActive = "percentage";
        row.lumpSum = ""; // Clear lumpSum when percentage is set
      }
    } else if (field === "lumpSum") {
      if (value === "" || value === "0") {
        row.amountFieldActive = null;
        row.lumpSum = "";
      } else {
        row.amountFieldActive = "lumpSum";
        row.percentage = ""; // Clear percentage when lumpSum is set
      }
    }

    if (
      field === "dueAfterDays" ||
      field === "percentage" ||
      field === "lumpSum"
    ) {
      validateField(field, value, index);
    } else {
      setErrors((prev) => ({ ...prev, [field + "-" + index]: "" }));
    }

    updatedRows[index] = row;
    setTableData({ ...tableData, rows: updatedRows });
  };

  const handleTableBlur = (index, field) => {
    setTouched((prev) => ({ ...prev, [field + "-" + index]: true }));
    validateField(field, tableData.rows[index][field], index);
  };

  const validateField = (field, value, rowIndex = null) => {
    let error = "";
    if (field === "dueAfterDays") {
      if (value && isNaN(Number(value))) {
        error = "Must be a number";
      } else if (value && Number(value) < 0) {
        error = "Must be positive";
      }
    } else if (field === "percentage") {
      if (value && isNaN(Number(value))) {
        error = "Must be a number";
      } else if (value && (Number(value) < 0 || Number(value) > 100)) {
        error = "Must be between 0 and 100";
      }
    } else if (field === "lumpSum") {
      if (value && isNaN(Number(value))) {
        error = "Must be a number";
      } else if (value && Number(value) < 0) {
        error = "Must be positive";
      }
    }

    if (rowIndex !== null) {
      setErrors((prev) => ({
        ...prev,
        [field + "-" + rowIndex]: error,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tableData) {
      alert("No table data to submit.");
      return;
    }

    // Validate all rows have required fields
    const isValid = tableData.rows.every((row) => {
      const hasDueField = row.dueAfterDays || row.dueDate;
      const hasAmountField = row.percentage || row.lumpSum;
      return hasDueField && hasAmountField;
    });

    if (!isValid) {
      alert(
        "Please fill in either Due After Days or Due Date and either Percentage or Lump-sum Amount for each row."
      );
      return;
    }

    // Validate numeric values
    let tableErrors = {};
    tableData.rows.forEach((row, index) => {
      if (row.dueAfterDays && (isNaN(Number(row.dueAfterDays)) || Number(row.dueAfterDays) < 0)) {
        tableErrors["dueAfterDays-" + index] = "Must be a positive number";
      }
      if (row.percentage && (isNaN(Number(row.percentage)) || Number(row.percentage) < 0)) {
        tableErrors["percentage-" + index] = "Must be a positive number";
      }
      if (row.lumpSum && (isNaN(Number(row.lumpSum)) || Number(row.lumpSum) < 0)) {
        tableErrors["lumpSum-" + index] = "Must be a positive number";
      }
    });

    if (Object.keys(tableErrors).length > 0) {
      setErrors(tableErrors);
      return;
    }
    
    try {
      // Update installment details
      const detailsResponse = await fetch(
        `http://localhost:5000/api/master/update-installment-plan/${planName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            no_of_installments: tableData.rows.length,
            installment_details: tableData.rows.map(row => {
              // Handle amount and percentage properly
              let amount = null;
              let percentage = null;
              
              if (row.amountFieldActive === "lumpSum" && row.lumpSum) {
                amount = parseFloat(row.lumpSum);
              } else if (row.amountFieldActive === "percentage" && row.percentage) {
                percentage = parseFloat(row.percentage);
              }
              
              return {
                installment_number: row.installment,
                amount: amount,
                percentage: percentage,
                due_after_days: row.dueAfterDays ? parseInt(row.dueAfterDays) : 0,
                due_date: row.dueDate || null,
                remarks: row.remarks || ""
              };
            })
          }),
        }
      );
      
      if (!detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        throw new Error(detailsData.message || "Failed to update installment details");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/masters/plans");
      }, 2000);
    } catch (error) {
      console.error("Error updating plan:", error);
      setError("Failed to update plan. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/masters/plans")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>Back to Plans</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
            <CheckCircle className="mr-2" size={18} />
            <span>Plan updated successfully!</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : !plan ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">Plan not found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800">Edit Plan: {plan.plan_name}</h1>
            </div>

            {tableData && (
              <div className="p-6">
                <div>
                  <table className="min-w-full divide-y divide-gray-300 table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-28">
                          Installment Number
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                          Due After Days
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-44">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                          Percentage
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-36">
                          Lump-sum Amount
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider w-56">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tableData.rows.map((row, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {row.installment}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 text-center">
                            {errors["dueAfterDays-" + index] &&
                              touched["dueAfterDays-" + index] && (
                                <p className="text-red-500 text-sm">
                                  {errors["dueAfterDays-" + index]}
                                </p>
                              )}
                            <input
                              type="number"
                              value={row.dueAfterDays}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "dueAfterDays",
                                  e.target.value
                                )
                              }
                              onBlur={() => handleTableBlur(index, "dueAfterDays")}
                              className={`w-20 p-2 border rounded-md focus:outline-none focus:ring-2 mx-auto block ${
                                errors["dueAfterDays-" + index] &&
                                touched["dueAfterDays-" + index]
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-black focus:ring-green-500"
                              } ${
                                row.dueFieldActive &&
                                row.dueFieldActive !== "dueAfterDays"
                                  ? "bg-gray-200 cursor-not-allowed"
                                  : ""
                              }`}
                              placeholder="Days"
                              disabled={
                                row.dueFieldActive &&
                                row.dueFieldActive !== "dueAfterDays"
                              }
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 text-center">
                            <input
                              type="date"
                              value={row.dueDate}
                              onChange={(e) =>
                                handleInputChange(index, "dueDate", e.target.value)
                              }
                              className={`w-36 p-2 border rounded-md focus:outline-none focus:ring-2 mx-auto block border-black focus:ring-green-500 ${
                                row.dueFieldActive &&
                                row.dueFieldActive !== "dueDate"
                                  ? "bg-gray-200 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                row.dueFieldActive &&
                                row.dueFieldActive !== "dueDate"
                              }
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 text-center">
                            {errors["percentage-" + index] &&
                              touched["percentage-" + index] && (
                                <p className="text-red-500 text-sm">
                                  {errors["percentage-" + index]}
                                </p>
                              )}
                            <input
                              type="number"
                              value={row.percentage}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "percentage",
                                  e.target.value
                                )
                              }
                              onBlur={() => handleTableBlur(index, "percentage")}
                              className={`w-20 p-2 border rounded-md focus:outline-none focus:ring-2 mx-auto block ${
                                errors["percentage-" + index] &&
                                touched["percentage-" + index]
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-black focus:ring-green-500"
                              } ${
                                row.amountFieldActive &&
                                row.amountFieldActive !== "percentage"
                                  ? "bg-gray-200 cursor-not-allowed"
                                  : ""
                              }`}
                              placeholder="%"
                              disabled={
                                row.amountFieldActive &&
                                row.amountFieldActive !== "percentage"
                              }
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 text-center">
                            {errors["lumpSum-" + index] &&
                              touched["lumpSum-" + index] && (
                                <p className="text-red-500 text-sm">
                                  {errors["lumpSum-" + index]}
                                </p>
                              )}
                            <input
                              type="number"
                              value={row.lumpSum}
                              onChange={(e) =>
                                handleInputChange(index, "lumpSum", e.target.value)
                              }
                              onBlur={() => handleTableBlur(index, "lumpSum")}
                              className={`w-28 p-2 border rounded-md focus:outline-none focus:ring-2 mx-auto block ${
                                errors["lumpSum-" + index] &&
                                touched["lumpSum-" + index]
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-black focus:ring-green-500"
                              } ${
                                row.amountFieldActive &&
                                row.amountFieldActive !== "lumpSum"
                                  ? "bg-gray-200 cursor-not-allowed"
                                  : ""
                              }`}
                              placeholder="Amount"
                              disabled={
                                row.amountFieldActive &&
                                row.amountFieldActive !== "lumpSum"
                              }
                            />
                          </td>
                          <td className="px-1 py-4 text-sm text-gray-500">
                            <input
                              type="text"
                              value={row.remarks}
                              onChange={(e) =>
                                handleInputChange(index, "remarks", e.target.value)
                              }
                              className="w-[200px] p-2 border rounded-md focus:outline-none focus:ring-2 border-black focus:ring-green-500"
                              style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                              }}
                              placeholder="Remarks"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleSubmit}
                    className="w-[200] bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Update Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPlan; 