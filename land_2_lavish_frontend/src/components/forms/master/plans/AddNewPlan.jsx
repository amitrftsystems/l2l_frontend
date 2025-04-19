import { useState, useEffect } from "react";

function AddNewPlan() {
  const [planName, setPlanName] = useState("");
  const [numInstallments, setNumInstallments] = useState("");
  const [tableData, setTableData] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [installmentPlans, setInstallmentPlans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInstallments();
  }, []);

  // Handle form input changes and validate
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "planName") {
      setPlanName(value);
    } else if (name === "numInstallments") {
      setNumInstallments(value);
    }
    validateField(name, value);
  };

  // Handle form blur to mark fields as touched
  const handleFormBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, name === "planName" ? planName : numInstallments);
  };

  // Validate form and table fields
  const validateField = (name, value, rowIndex = null) => {
    let error = "";
    if (name === "planName") {
      if (!value) error = "Plan name is required";
    } else if (name === "numInstallments") {
      if (!value) {
        error = "Number of installments is required";
      } else if (isNaN(Number(value))) {
        error = "Must be a number";
      } else if (Number(value) < 1) {
        error = "Must be at least 1";
      }
    } else if (
      name === "dueAfterDays" ||
      name === "percentage" ||
      name === "lumpSum"
    ) {
      if (value && isNaN(Number(value))) {
        error = "Must be a number";
      } else if (value && Number(value) < 0) {
        error = "Must be positive";
      }
    }

    if (rowIndex !== null) {
      setErrors((prev) => ({
        ...prev,
        [name + "-" + rowIndex]: error,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const installments = parseInt(numInstallments);
    let newErrors = {};
    if (!planName) newErrors.planName = "Plan name is required";
    if (!numInstallments) {
      newErrors.numInstallments = "Number of installments is required";
    } else if (isNaN(installments) || installments < 1) {
      newErrors.numInstallments = "Must be a number greater than 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let newRows;
    if (tableData && tableData.rows) {
      const existingRows = tableData.rows;
      const filledRows = existingRows.filter(
        (row) =>
          row.dueAfterDays ||
          row.dueDate ||
          row.percentage ||
          row.lumpSum ||
          row.remarks
      ).length;
      if (filledRows > installments) {
        const confirm = window.confirm(
          `Reducing the number of rows from ${
            existingRows.length
          } to ${installments} will delete data in ${
            filledRows - installments
          } row(s). Do you want to proceed?`
        );
        if (!confirm) return;
      }

      newRows = [];
      for (let i = 0; i < installments; i++) {
        if (i < existingRows.length) {
          newRows.push({ ...existingRows[i] });
        } else {
          newRows.push({
            installment: i + 1,
            dueAfterDays: "",
            dueDate: "",
            percentage: "",
            lumpSum: "",
            remarks: "",
            dueFieldActive: null,
            amountFieldActive: null,
          });
        }
      }

      newRows.forEach((row, index) => {
        row.installment = index + 1;
      });
    } else {
      newRows = Array.from({ length: installments }, (_, index) => ({
        installment: index + 1,
        dueAfterDays: "",
        dueDate: "",
        percentage: "",
        lumpSum: "",
        remarks: "",
        dueFieldActive: null,
        amountFieldActive: null,
      }));
    }

    const updatedErrors = {};
    const updatedTouched = {};
    Object.keys(errors).forEach((key) => {
      const [, rowIndex] = key.split("-");
      if (!rowIndex || parseInt(rowIndex) < installments) {
        updatedErrors[key] = errors[key];
      }
    });
    Object.keys(touched).forEach((key) => {
      const [, rowIndex] = key.split("-");
      if (!rowIndex || parseInt(rowIndex) < installments) {
        updatedTouched[key] = touched[key];
      }
    });

    setTableData({ planName, rows: newRows });
    setErrors(updatedErrors);
    setTouched(updatedTouched);
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
    } else if (field === "percentage" || field === "lumpSum") {
      if (value === "") {
        row.amountFieldActive = null;
      } else if (!row.amountFieldActive) {
        row.amountFieldActive = field;
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

  const handleTableSubmit = async () => {
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
      // Step 1: Create the installment plan
      const planResponse = await fetch(
        "http://localhost:5000/api/master/add-new-installment-plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan_name: tableData.planName,
            no_of_installments: tableData.rows.length,
          }),
        }
      );

      const planData = await planResponse.json();
      
      if (!planResponse.ok) {
        if (planData.message.includes("already exists")) {
          throw new Error("An installment plan with this name already exists. Please choose a different name.");
        }
        throw new Error(planData.message || "Failed to create installment plan");
      }

      // Step 2: Add installment details
      const detailsResponse = await fetch(
        "http://localhost:5000/api/master/add-installment-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan_name: tableData.planName,
            installment_number: tableData.rows.map(row => row.installment),
            amount: tableData.rows.map(row => {
              const value = row.lumpSum;
              if (!value || value === "" || isNaN(value)) return 0;
              return parseFloat(value);
            }),
            percentage: tableData.rows.map(row => {
              const value = row.percentage;
              if (!value || value === "" || isNaN(value)) return 0;
              return parseFloat(value);
            }),
            due_after_days: tableData.rows.map(row => {
              const value = row.dueAfterDays;
              if (!value || value === "" || isNaN(value)) return 0;
              return parseInt(value);
            }),
            due_date: tableData.rows.map(row => {
              const value = row.dueDate;
              if (!value || value === "") {
                // If no date is provided, calculate it based on due_after_days
                const days = row.dueAfterDays;
                if (days && !isNaN(days)) {
                  const date = new Date();
                  date.setDate(date.getDate() + parseInt(days));
                  return date.toISOString();
                }
                // If no due_after_days either, use today's date
                return new Date().toISOString();
              }
              const date = new Date(value);
              return date instanceof Date && !isNaN(date) ? date.toISOString() : new Date().toISOString();
            }),
          }),
        }
      );

      if (!detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        throw new Error(detailsData.message || "Failed to add installment details");
      }

      alert("Installment plan and details submitted successfully!");
      setPlanName("");
      setNumInstallments("");
      setTableData(null);
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(error.message || "Failed to submit data. Please try again.");
    }
  };

  const fetchInstallments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/master/get-installment-plan");
      if (!response.ok) {
        throw new Error("Failed to fetch installment plans");
      }
      const data = await response.json();
      if (data.success) {
        setInstallmentPlans(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch installment plans");
      }
    } catch (error) {
      console.error("Error fetching installment plans:", error);
      setError("Failed to load installment plans. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#272727] flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Installment Plan
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}


        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex space-x-4 mb-4">
            {/* Installment Plan Name */}
            <div className="w-1/2">
              <label
                htmlFor="planName"
                className="block text-sm font-medium text-gray-700"
              >
                Installment Plan Name <span className="text-red-600">*</span>
              </label>
              {errors.planName && touched.planName && (
                <p className="text-red-500 text-sm">{errors.planName}</p>
              )}
              <input
                type="text"
                id="planName"
                name="planName"
                value={planName}
                onChange={handleFormChange}
                onBlur={handleFormBlur}
                className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.planName && touched.planName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-black focus:ring-green-500"
                }`}
                required
              />
            </div>

            {/* Number of Installments */}
            <div className="w-1/2">
              <label
                htmlFor="numInstallments"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Installments <span className="text-red-600">*</span>
              </label>
              {errors.numInstallments && touched.numInstallments && (
                <p className="text-red-500 text-sm">{errors.numInstallments}</p>
              )}
              <input
                type="number"
                id="numInstallments"
                name="numInstallments"
                value={numInstallments}
                onChange={handleFormChange}
                onBlur={handleFormBlur}
                min="1"
                className={`w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.numInstallments && touched.numInstallments
                    ? "border-red-500 focus:ring-red-500"
                    : "border-black focus:ring-green-500"
                }`}
                required
              />
            </div>
          </div>
          <div className="mb-6"></div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-[200px] bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Generate Table
            </button>
          </div>
        </form>

        {/* Table */}
        {tableData && (
          <div>
            <h3 className="text-xl font-semibold mb-4">{tableData.planName}</h3>
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
                onClick={handleTableSubmit}
                className="w-[200] bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddNewPlan;