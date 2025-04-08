import React, { useState } from 'react';

const  CallingFeedback = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    name: '',
    address: '',
    callType: 'Outgoing',
    payment: false,
    loan: false,
    promiseDate: '',
    amountCommitted: '',
    issueDescription: 'Other',
    remarks: '',
    email: {
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      content: ''
    },
    dispatch: {
      letterType: '',
      date: '',
      remarks: ''
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-[#272727] flex justify-center items-center p-6">
    <div className="max-w-4xl mx-auto p-4 rounded-lg bg-white">
      <div className="text-center mb-4">
     
      <h1 className="text-2xl font-bold text-center mb-1">ADD CUSTOMER'S FEEDBACK</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Main Customer Information - Pink Section */}
        <div className="bg-pink-100 p-4 rounded-md mb-4">
          <div className="grid grid-cols-1  gap-4 mb-4">
            <div className="flex items-center">
              <label className="w-32 font-semibold">Customer ID</label>
              <input
                type="text"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className="border rounded bg-white px-2 py-1 flex-grow"
              />
            </div>
            
            <div className="flex items-center">
              <label className="w-32 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded px-2 py-1 flex-grow"
              />
            </div>

            <div className="flex items-center">
              <label className="w-32 font-semibold">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border rounded px-2 py-1 flex-grow"
              />
            </div>

            <div className="flex items-center">
              <label className="w-32 font-semibold">Next Calling Date</label>
              <div className="flex">
                <select className="border rounded px-1 py-1 mr-1">
                  {[...Array(31)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
                <select className="border rounded px-1 py-1 mr-1">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select className="border rounded px-1 py-1">
                  {[...Array(10)].map((_, i) => (
                    <option key={2020+i} value={2020+i}>{2020+i}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 font-semibold">Type</label>
              <select
                name="callType"
                value={formData.callType}
                onChange={handleChange}
                className="border rounded px-2 py-1 flex-grow"
              >
                <option value="Outgoing">Outgoing</option>
                <option value="Incoming">Incoming</option>
                <option value="Missed">Missed</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="w-32 font-semibold">Payment</label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paymentYes"
                  name="payment"
                  checked={formData.payment}
                  onChange={() => setFormData({...formData, payment: true})}
                  className="mr-1"
                />
                <label htmlFor="paymentYes" className="mr-4">Yes</label>
                
                <input
                  type="radio"
                  id="paymentNo"
                  name="payment"
                  checked={!formData.payment}
                  onChange={() => setFormData({...formData, payment: false})}
                  className="mr-1"
                />
                <label htmlFor="paymentNo">No</label>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 font-semibold">Loan</label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="loanYes"
                  name="loan"
                  checked={formData.loan}
                  onChange={() => setFormData({...formData, loan: true})}
                  className="mr-1"
                />
                <label htmlFor="loanYes" className="mr-4">Yes</label>
                
                <input
                  type="radio"
                  id="loanNo"
                  name="loan"
                  checked={!formData.loan}
                  onChange={() => setFormData({...formData, loan: false})}
                  className="mr-1"
                />
                <label htmlFor="loanNo">No</label>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 font-semibold">Promise to Pay on</label>
              <div className="flex items-center">
                <select className="border rounded px-1 py-1 mr-1">
                  {[...Array(31)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
                <select className="border rounded px-1 py-1 mr-1">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select className="border rounded px-1 py-1 mr-1">
                  {[...Array(10)].map((_, i) => (
                    <option key={2020+i} value={2020+i}>{2020+i}</option>
                  ))}
                </select>
                <span className="mx-2">Amt Committed to pay</span>
                <input
                  type="text"
                  name="amountCommitted"
                  value={formData.amountCommitted}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 w-24"
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-32 font-semibold">Issue if any</label>
              <select
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleChange}
                className="border rounded px-2 py-1 flex-grow"
              >
                <option value="Other">Other</option>
                <option value="Payment">Payment</option>
                <option value="Service">Service</option>
                <option value="Product">Product</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Today's Description</label>
            <select
              name="todaysDescription"
              className="border rounded px-2 py-1 w-full"
            >
              <option value="Other">Other</option>
              <option value="Called">Called</option>
              <option value="Visit">Visit</option>
              <option value="Meeting">Meeting</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full h-20"
            ></textarea>
          </div>
        </div>

        {/* Email Section - Blue Section */}
        <div className="bg-blue-100 p-4 rounded-md mb-4">
          <div className="flex items-center mb-2">
            <label className="w-32 font-semibold">Send E-Mail</label>
            <input type="checkbox" className="mr-1" />
          </div>
          
          <div className="flex items-center mb-2">
            <label className="w-32 font-semibold">To</label>
            <input
              type="text"
              name="email.to"
              value={formData.email.to}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-grow mr-2"
            />
            <label className="w-8 font-semibold">CC</label>
            <input
              type="text"
              name="email.cc"
              value={formData.email.cc}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-grow"
            />
          </div>
          
          <div className="flex items-center mb-2">
            <label className="w-32 font-semibold">Subject</label>
            <input
              type="text"
              name="email.subject"
              value={formData.email.subject}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-grow"
            />
          </div>
          
          <div className="mb-2">
            <label className="block font-semibold mb-1">Mail Content</label>
            <textarea
              name="email.content"
              value={formData.email.content}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full h-20"
            ></textarea>
          </div>
        </div>

        {/* Dispatch Section - Pink Section */}
        <div className="bg-pink-100 p-4 rounded-md mb-4">
          <div className="text-pink-500 font-bold mb-2">Information for Dispatch Section :</div>
          
          <div className="flex items-center mb-2">
            <label className="w-32 font-semibold">Letter Type</label>
            <select
              name="dispatch.letterType"
              value={formData.dispatch.letterType}
              onChange={handleChange}
              className="border rounded px-2 py-1 flex-grow"
            >
              <option value="">Select</option>
              <option value="Reminder">Reminder</option>
              <option value="Notification">Notification</option>
              <option value="Statement">Statement</option>
            </select>
          </div>
          
          <div className="flex items-center mb-2">
            <label className="w-32 font-semibold">Dispatch Date</label>
            <div className="flex">
              <select className="border rounded px-1 py-1 mr-1">
                <option value="day">Day</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
              <select className="border rounded px-1 py-1 mr-1">
                <option value="month">Month</option>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select className="border rounded px-1 py-1">
                <option value="year">Year</option>
                {[...Array(10)].map((_, i) => (
                  <option key={2020+i} value={2020+i}>{2020+i}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block font-semibold mb-1">Remarks</label>
            <textarea
              name="dispatch.remarks"
              value={formData.dispatch.remarks}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full h-20"
            ></textarea>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm">Collection Letter | Add/Update</div>
            <div className="text-sm">Phone/Mobile/Fax/PAN No.</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button 
            type="submit" 
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Update
          </button>
          <button 
            type="reset" 
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default CallingFeedback;