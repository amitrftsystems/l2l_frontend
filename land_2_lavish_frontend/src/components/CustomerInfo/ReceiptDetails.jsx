import React from "react";

const ReceiptDetails = () => {
  const receipts = [
    {
      receiptNo: "HLAGH/2019/1 (D)",
      receiptDate: "27-Nov-2019",
      chequeDate: "23-Nov-2019",
      chequeNo: "000026",
      drawnOn: "BANK OF BARODA, DELHI",
      totalAmount: "119184",
      basic: "118004",
      others: "1180",
      status: "B",
    },
    {
      receiptNo: "HLAGH/2020/1179",
      receiptDate: "08-Sep-2020",
      chequeDate: "02-Sep-2020",
      chequeNo: "000029",
      drawnOn: "BANK OF BARODA, NAJAFGARH",
      totalAmount: "480000",
      basic: "475248",
      others: "4752",
      status: "C",
    },
    {
      receiptNo: "HLAGH/2021/992",
      receiptDate: "12-Apr-2021",
      chequeDate: "06-Apr-2021",
      chequeNo: "000030",
      drawnOn: "BANK OF BARODA, NAJAFGARH",
      totalAmount: "298516",
      basic: "295560",
      others: "2956",
      status: "C",
    },
    {
      receiptNo: "HLAGH/2021/1455",
      receiptDate: "16-Jul-2021",
      chequeDate: "10-Jul-2021",
      chequeNo: "000034",
      drawnOn: "BANK OF BARODA, DELHI",
      totalAmount: "299232",
      basic: "296269",
      others: "2963",
      status: "C",
    },
    {
      receiptNo: "HLAGH/2022/350",
      receiptDate: "28-Feb-2022",
      chequeDate: "10-Feb-2022",
      chequeNo: "415045",
      drawnOn: "CANARA BANK, DELHI",
      totalAmount: "299233",
      basic: "296270",
      others: "2963",
      status: "C",
    },
    {
      receiptNo: "HLAGH/2022/936",
      receiptDate: "31-Aug-2022",
      chequeDate: "22-Aug-2022",
      chequeNo: "415046",
      drawnOn: "CANARA BANK, DELHI",
      totalAmount: "299232",
      basic: "296269",
      others: "2963",
      status: "C",
    },
    {
      receiptNo: "HLAGH/2024/41",
      receiptDate: "05-Jul-2024",
      chequeDate: "01-Jul-2024",
      chequeNo: "000047",
      drawnOn: "BANK OF BARODA, DELHI",
      totalAmount: "299232",
      basic: "296269",
      others: "2963",
      status: "C",
    },
  ];

  return (
    <div className="overflow-x-auto p-4">
      <table className="table-auto border-collapse w-full text-sm border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Sr. No.</th>
            <th className="border p-2">Receipt No.</th>
            <th className="border p-2">Receipt Date</th>
            <th className="border p-2">Cheque Date</th>
            <th className="border p-2">Cheque No.</th>
            <th className="border p-2">Drawn On</th>
            <th className="border p-2">Total Amount</th>
            <th className="border p-2">Basic</th>
            <th className="border p-2">Others</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((receipt, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2 text-blue-600 underline">
                {receipt.receiptNo}
              </td>
              <td className="border p-2">{receipt.receiptDate}</td>
              <td className="border p-2">{receipt.chequeDate}</td>
              <td className="border p-2">{receipt.chequeNo}</td>
              <td className="border p-2">{receipt.drawnOn}</td>
              <td className="border p-2">{receipt.totalAmount}</td>
              <td className="border p-2">{receipt.basic}</td>
              <td className="border p-2">{receipt.others}</td>
              <td
                className={`border p-2 font-bold ${
                  receipt.status === "B" ? "text-red-500" : "text-green-500"
                }`}
              >
                {receipt.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReceiptDetails;
