import React, { useState } from 'react';

const MoneyReceipt = () => {
  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [chequeDate, setChequeDate] = useState(getCurrentDate());
  const [unitSize, setUnitSize] = useState('');
  const [unitType, setUnitType] = useState('sq.ft');
  const [propertyDescription, setPropertyDescription] = useState('1 BHK Affordable Residential Flat');
  const [unitNumber, setUnitNumber] = useState('A-101'); // Default unit number
  
  // Mock function to simulate database fetch for property description
  const fetchPropertyDescription = () => {
    console.log('Fetching property description from database...');
    // In a real implementation, this would be an API call
    // setPropertyDescription(fetchedData);
  };
  
  // Mock function to simulate database fetch for unit number
  const fetchUnitNumber = () => {
    console.log('Fetching unit number from database...');
    // Simulating a database fetch with a timeout
    setTimeout(() => {
      setUnitNumber('A-203'); // This would normally come from an API response
    }, 500);
  };
  
  return (
    <div className="min-h-screen bg-[#272727] flex justify-center items-center p-6">
    <div className="bg-white p-4 max-w-4xl rounded-lg shadow-lg mx-auto font-sans">
      <h1 className="text-2xl font-bold text-center mb-1">PAYMENT RECEIPT</h1>
        <p className="text-s text-center text-[#272727] mb-2">
          Fields marked by <span className="text-red-500">*</span> are mandatory
        </p>
      
      {/* Top Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-200 p-2 rounded">
          <div className="flex items-center mb-2">
            <label className="w-1/4">Date</label>
            <div className="w-3/4">
              <input 
                type="date" 
                className="border border-gray-400 px-2 py-1 w-full bg-white" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={getCurrentDate()} // Only allows current date and future dates
              />
            </div>
          </div>
          
          <div className="flex items-center mb-2">
            <label className="w-1/4">Customer ID</label>
            <input type="text" className="border border-gray-400 px-2 py-1 w-3/4 bg-white" defaultValue="C/RG-00953" />
          </div>
          
          <div className="flex items-center mb-2">
            <label className="w-1/4">Manual Receipt No.</label>
            <input type="text" className="border border-gray-400 px-2 py-1 w-3/4 bg-white" />
          </div>
          
          <div className="flex items-center mb-2">
            <label className="w-1/4">Booking Receipt <span className="text-red-500">*</span></label>
            <input type="checkbox" className="mr-2" />
            <label className="w-1/4">Unit Size</label>
            <div className="flex w-1/2">
              <input 
                type="text" 
                className="border border-gray-400 px-2 py-1 w-2/3 bg-white" 
                value={unitSize}
                onChange={(e) => setUnitSize(e.target.value)}
                placeholder="Enter size"
              />
              <select 
                className="border border-gray-400 px-2 py-1 w-1/3 bg-white ml-1"
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
              >
                <option value="sq.ft">sq.ft</option>
                <option value="sq.m">sq.m</option>
                <option value="yards">yards</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center mb-2">
            <label className="w-1/4">Receiving (Cash+Cheque)</label>
            <div className="flex items-center w-3/4">
              <label className="w-1/4">Cash Amount</label>
              <input type="text" className="border border-gray-400 px-2 py-1 w-1/3 bg-white" />
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="w-1/4">Deposited In</label>
            <input type="checkbox" className="mr-2" />
            <label className="w-1/5">Bank</label>
            <select className="border border-gray-400 px-2 py-1 w-1/3 bg-white">
              <option>Select</option>
            </select>
          </div>
        </div>
        
        <div className="bg-blue-200 p-2 rounded">
          <div className="mb-2">
            <label className="inline-block">Unit No.</label>
            <div className="inline-block float-right w-3/4">
              <input 
                type="text" 
                className="border border-gray-400 px-2 py-1 w-full bg-white" 
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                readOnly
              />
              <div className="text-xs text-gray-500 mt-1">
                (Auto-fetched from database)
              </div>
              <button 
                className="text-xs text-blue-600 underline mt-1"
                onClick={fetchUnitNumber}
              >
                Refresh from DB
              </button>
            </div>
          </div>
          
          <div className="mb-2">
            <label className="inline-block">Name</label>
            <input type="text" className="border border-gray-400 px-2 py-1 w-3/4 bg-white float-right" defaultValue="Test" />
          </div>
          
          <div className="mb-2">
            <label className="inline-block">Address</label>
            <input type="text" className="border border-gray-400 px-2 py-1 w-3/4 bg-white float-right" defaultValue="A" />
          </div>
          
          <div className="mb-2">
            <span className="inline-block w-1/4">Sq. Ft.</span>
            <input type="checkbox" className="mr-2" />
            <label className="inline-block w-1/3">Property Description</label>
          </div>
          
          <div className="mb-2">
            <div className="flex items-center">
              <label className="inline-block w-1/3">Property Description</label>
              <div className="w-2/3">
                <input 
                  type="text" 
                  className="border border-gray-400 px-2 py-1 w-full bg-white" 
                  value={propertyDescription}
                  onChange={(e) => setPropertyDescription(e.target.value)}
                  readOnly
                />
                <div className="text-xs text-gray-500 mt-1">
                  (Auto-fetched from database)
                </div>
                <button 
                  className="text-xs text-blue-600 underline mt-1"
                  onClick={fetchPropertyDescription}
                >
                  Refresh from DB
                </button>
              </div>
            </div>
          </div>
          
          <div className="mb-2">
            <label className="inline-block">Cheque Amount</label>
            <input type="text" className="border border-gray-400 px-2 py-1 w-1/2 bg-white ml-2" />
            <span className="ml-2 text-xs text-red-500">@ This is only for Booking Receipt</span>
          </div>
          
          <div className="flex items-center">
            <label className="w-1/5">Branch</label>
            <select className="border border-gray-400 px-2 py-1 w-1/3 bg-white">
              <option></option>
            </select>
            <span className="ml-4">XXXX</span>
          </div>
        </div>
      </div>
      
      {/* Add Cheque Details Section */}
      <div className="mb-4">
        <div className="bg-pink-200 p-2 rounded">
          <div className="font-bold mb-2">ADD CHEQUE/DD DETAILS :</div>
          <div className="grid grid-cols-6 gap-2">
            <div>
              <label className="block text-sm">PAY Amt.</label>
              <input type="text" className="border border-gray-400 px-2 py-1 w-full bg-white" />
            </div>
            <div>
              <label className="block text-sm">PAY Mode</label>
              <select className="border border-gray-400 px-2 py-1 w-full bg-white">
                <option>Select</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Cheque/DD No.</label>
              <input type="text" className="border border-gray-400 px-2 py-1 w-full bg-white" />
            </div>
            <div>
              <label className="block text-sm">Cheque Dt.</label>
              <input 
                type="date" 
                className="border border-gray-400 px-2 py-1 w-full bg-white" 
                value={chequeDate}
                onChange={(e) => setChequeDate(e.target.value)}
                min={getCurrentDate()} // Only allows current date and future dates
              />
            </div>
            <div>
              <label className="block text-sm">Draw On</label>
              <input type="text" className="border border-gray-400 px-2 py-1 w-full bg-white" />
            </div>
            <div>
              <label className="block text-sm">Send SMS</label>
              <div className="flex items-center h-8">
                <input type="checkbox" className="mr-2" />
              </div>
            </div>
          </div>
          <div className="mt-2">
            <label className="block text-sm">SMS Text Mobile No.</label>
            <input type="text" className="border border-gray-400 px-2 py-1 w-48 bg-white" />
            <textarea className="border border-gray-400 px-2 py-1 w-full mt-1 bg-white h-20"></textarea>
          </div>
        </div>
      </div>
      
      {/* Charge Wise Details Section */}
      <div className="mb-4">
        <div className="bg-blue-100 p-2 rounded">
          <div className="font-bold mb-2">ADD CHARGE WISE DETAILS :</div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-2 py-1 bg-green-200 text-left">Charge Type</th>
                  <th className="border border-gray-400 px-2 py-1 bg-green-200 text-left">Install No.</th>
                  <th className="border border-gray-400 px-2 py-1 bg-green-200 text-left">Amount</th>
                  <th className="border border-gray-400 px-2 py-1 bg-green-200 text-left">CGST</th>
                  <th className="border border-gray-400 px-2 py-1 bg-green-200 text-left">SGST</th>
                  <th className="border border-gray-400 px-2 py-1 bg-green-200 text-left">Remark</th>
                </tr>
              </thead>
              <tbody>
                {[
                  'BASIC', 'EDC', 'PLC', 'GST@12', 'GST@18', 'ST@2.75', 'ST@0.125_S.B.Cess', 'ST@0.125_K.K.Cess',
                  'ST@10.30', 'ST@0.50_S.B.Cess', 'ST@0.50_K.K.Cess', 'INT', 'TC', 'TC.ST', 'REFUND', 'ECWC',
                  'IPMS', 'VAT', 'PB', 'GBP', 'OA', 'PFC', 'BMIC', 'WMIC'
                ].map((type, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400 px-2 py-1">
                      <input type="checkbox" className="mr-2" />
                      {type}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      <input type="text" className="w-full border border-gray-400 px-1" />
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      <input type="text" className="w-full border border-gray-400 px-1" />
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      <input type="text" className="w-full border border-gray-400 px-1" defaultValue="0" />
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      <input type="text" className="w-full border border-gray-400 px-1" defaultValue="0" />
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      <input type="text" className="w-full border border-gray-400 px-1" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="mb-4">
        <div className="bg-blue-200 p-2 rounded flex items-center">
          <label className="mr-2">Accepted By</label>
          <select className="border border-gray-400 px-2 py-1 w-32 bg-white">
            <option>Select</option>
          </select>
          <div className="ml-auto flex items-center">
            <label className="mr-2">Booking Amount</label>
            <input type="checkbox" />
          </div>
        </div>
      </div>
      
      {/* Footer Links */}
      <div className="text-center mb-4">
        <span>Bank &gt;&gt; | </span>
        <a href="#" className="text-blue-600">Add</a>
        <span> | </span>
        <a href="#" className="text-blue-600">Update</a>
        <span> || </span>
        <a href="#" className="text-blue-600">View Payment Details</a>
        <span> | </span>
        <a href="#" className="text-blue-600">Final Statement</a>
        <span> || </span>
        <span>Bank Branch &gt;&gt; | </span>
        <a href="#" className="text-blue-600">Add</a>
        <span> | </span>
        <a href="#" className="text-blue-600">Update</a>
        <span> |</span>
      </div>
      
      {/* Action Buttons */}
      <div className="text-center mb-4">
        <button className="border border-gray-400 bg-gray-200 px-4 py-1 mx-auto">ADD</button>
      </div>
      
      <div className="text-center mb-4">
        <div className="mb-2">Cheque Send To Bank</div>
        <button className="border border-gray-400 bg-gray-200 px-4 py-1 mx-auto">Print Receipt</button>
      </div>
    </div>
    </div>
  );
};

export default MoneyReceipt;