import { useState } from "react";

function AddNewPlan() {
  const [planName, setPlanName] = useState("");
  const [numInstallments, setNumInstallments] = useState("");
  const [tableData, setTableData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const installments = parseInt(numInstallments);
    if (isNaN(installments) || installments < 1) {
      alert("Please enter a valid number of installments.");
      return;
    }

    const rows = Array.from({ length: installments }, (_, index) => ({
      installment_number: index + 1,
      amount: "",
      percentage: "",
      due_after_days: "",
      due_date: "",
      dueFieldActive: null,
      amountFieldActive: null,
    }));

    setTableData({ plan_name: planName, rows });
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...tableData.rows];
    const row = { ...updatedRows[index] };

    // Update the field value
    row[field] = value;

    // Determine which field pair is being updated
    if (field === "due_after_days" || field === "due_date") {
      if (value === "") {
        row.dueFieldActive = null;
      } else if (!row.dueFieldActive) {
        row.dueFieldActive = field;
      }
    } else if (field === "percentage" || field === "amount") {
      if (value === "") {
        row.amountFieldActive = null;
      } else if (!row.amountFieldActive) {
        row.amountFieldActive = field;
      }
    }

    updatedRows[index] = row;
    setTableData({ ...tableData, rows: updatedRows });
  };

  const handleTableSubmit = async () => {
    if (!tableData) {
      alert("No table data to submit.");
      return;
    }

    // Basic validation: Ensure all rows have required fields
    const isValid = tableData.rows.every((row) => {
      const hasDueField = row.due_after_days || row.due_date;
      const hasAmountField = row.percentage || row.amount;
      return hasDueField && hasAmountField;
    });

    if (!isValid) {
      alert(
        "Please fill in either Due After Days or Due Date and either Percentage or Amount for each row."
      );
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
            plan_name: tableData.plan_name,
            no_of_installments: tableData.rows.length,
          }),
        }
      );

      const planData = await planResponse.json();
      
      if (!planResponse.ok) {
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
            plan_name: tableData.plan_name,
            installment_number: tableData.rows.map(row => row.installment_number),
            amount: tableData.rows.map(row => {
              const value = row.amount;
              if (!value || value === "" || isNaN(value)) return 0;
              return parseFloat(value);
            }),
            percentage: tableData.rows.map(row => {
              const value = row.percentage;
              if (!value || value === "" || isNaN(value)) return 0;
              return parseFloat(value);
            }),
            due_after_days: tableData.rows.map(row => {
              const value = row.due_after_days;
              if (!value || value === "" || isNaN(value)) return 0;
              return parseInt(value);
            }),
            due_date: tableData.rows.map(row => {
              const value = row.due_date;
              if (!value || value === "") {
                // If no date is provided, calculate it based on due_after_days
                const days = row.due_after_days;
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
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(error.message || "Failed to submit data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Installment Plan
        </h2>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label
              htmlFor="planName"
              className="block text-sm font-medium text-gray-700"
            >
              Installment Plan Name
            </label>
            <input
              type="text"
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="numInstallments"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Installments
            </label>
            <input
              type="number"
              id="numInstallments"
              value={numInstallments}
              onChange={(e) => setNumInstallments(e.target.value)}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Generate Table
          </button>
        </form>

        {tableData && (
          <div>
            <h3 className="text-xl font-semibold mb-4">{tableData.plan_name}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Installment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due After Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.rows.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.installment_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          type="number"
                          value={row.due_after_days}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "due_after_days",
                              e.target.value
                            )
                          }
                          className={`w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            row.dueFieldActive &&
                            row.dueFieldActive !== "due_after_days"
                              ? "bg-gray-200 cursor-not-allowed"
                              : ""
                          }`}
                          placeholder="Days"
                          disabled={
                            row.dueFieldActive &&
                            row.dueFieldActive !== "due_after_days"
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          type="date"
                          value={row.due_date}
                          onChange={(e) =>
                            handleInputChange(index, "due_date", e.target.value)
                          }
                          className={`w-36 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            row.dueFieldActive &&
                            row.dueFieldActive !== "due_date"
                              ? "bg-gray-200 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={
                            row.dueFieldActive &&
                            row.dueFieldActive !== "due_date"
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                          className={`w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          type="number"
                          value={row.amount}
                          onChange={(e) =>
                            handleInputChange(index, "amount", e.target.value)
                          }
                          className={`w-28 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            row.amountFieldActive &&
                            row.amountFieldActive !== "amount"
                              ? "bg-gray-200 cursor-not-allowed"
                              : ""
                          }`}
                          placeholder="Amount"
                          disabled={
                            row.amountFieldActive &&
                            row.amountFieldActive !== "amount"
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <button
                onClick={handleTableSubmit}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Submit Table Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddNewPlan;