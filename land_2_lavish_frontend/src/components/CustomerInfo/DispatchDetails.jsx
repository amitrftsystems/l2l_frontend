export default function DispatchDetails() {
  return (
    <div className="p-6">
      {/* Despatch Details */}
      <div className="mt-[-2]">
        <h2 className="text-xl font-bold text-purple-700">
          Despatch Details :-
        </h2>
        <table className="w-full border-collapse mt-2">
          <thead>
            <tr className="bg-purple-300 text-white">
              <th className="p-2">Sr. No.</th>
              <th className="p-2">Despatch Dt</th>
              <th className="p-2">Letter Type</th>
              <th className="p-2">Consignment No.</th>
              <th className="p-2">Courier Company</th>
              <th className="p-2">POD Status</th>
              <th className="p-2">Remarks</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Unit Transfer History */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-green-700">
          Unit Transfer History :-
        </h2>
        <table className="w-full border-collapse mt-2">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="p-2">Sr. No.</th>
              <th className="p-2">Transfer Date</th>
              <th className="p-2">Customer ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Address</th>
              <th className="p-2">Broker (Phone/Mobile)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2 text-center">1.</td>
              <td className="p-2 text-center">HLAGH-1</td>
              <td className="p-2 text-center">
                SUMITRA DEVI W/O (Current Owner)
              </td>
              <td className="p-2 text-center text-pink-700">
                RZ-M 412, GOPAL NAGAR PHASE-2, KHAIRA ROAD, NAJAFGARH, DELHI
              </td>
              <td className="p-2 text-center">HL RESIDENCY PVT LTD</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Calling\Visit Details */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-blue-700">
          Calling\Visit Details :-
        </h2>
        <table className="w-full border-collapse mt-2">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2">Date : Time</th>
              <th className="p-2">Type</th>
              <th className="p-2">Interacted With</th>
              <th className="p-2">Customer's Response</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">20-Jan-2024: 11:01:55 AM</td>
              <td className="p-2">Outgoing</td>
              <td className="p-2">Guest</td>
              <td className="p-2">KAAM TOH HUA NIH H ABHI</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">19-Jan-2024: 10:23:12 AM</td>
              <td className="p-2">Outgoing</td>
              <td className="p-2">Guest</td>
              <td className="p-2">TRYING FOR EARLY PAYMENT</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">01-Apr-2021: 11:13:11 AM</td>
              <td className="p-2">Outgoing</td>
              <td className="p-2">Anil Gahlawat</td>
              <td className="p-2">
                NO RESPONSE FOR CALL MOBILE NO BUSY FOR LONG TIME
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-2">08-Mar-2021: 11:54:46 AM</td>
              <td className="p-2">Outgoing</td>
              <td className="p-2">Anil Gahlawat</td>
              <td className="p-2">AMOUNT COMMITTED TO PAY In This Week</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">09-Feb-2021: 11:56:02 AM</td>
              <td className="p-2">Outgoing</td>
              <td className="p-2">Guest</td>
              <td className="p-2">AMOUNT COMMITTED TO PAY</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">30-Jan-2021: 11:46:45 PM</td>
              <td className="p-2">Outgoing</td>
              <td className="p-2">Anil Gahlawat</td>
              <td className="p-2">AMOUNT COMMITTED TO PAY</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
