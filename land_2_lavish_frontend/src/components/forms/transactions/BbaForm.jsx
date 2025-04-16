import React, { useState } from 'react';

const BBAForm = () => {
  const [formData, setFormData] = useState({
    custId: '',
    name: '',
    address: '',
    phoneNo: '',
    mobileNo: '',
    returnDate: '',
    documentReceivedDate: '',
    customerType: '',
    addressProof: '',
    pan: null,
    passportSizePhotos: null,
    voterId: null,
    passport: null,
    rationCard: null,
    drivingLicense: null,
    bankAttestedSignature: null,
    authorizedPersonPhotos: null,
    memorandumOfArticle: null,
    articleOfAssociation: null,
    boardResolution: null,
    partnershipPhotos: null,
    partnershipDeed: null,
    authorityLetter: null,
    proprietorPhotos: null,
    addressProofFirm: null,
    bbaStatus: 'NA',
    givenToDate: '',
    executionDate: '',
    remarks: '',
    // Add checkbox states for each document
    panChecked: false,
    passportSizePhotosChecked: false,
    voterIdChecked: false,
    passportChecked: false,
    rationCardChecked: false,
    drivingLicenseChecked: false,
    bankAttestedSignatureChecked: false,
    authorizedPersonPhotosChecked: false,
    memorandumOfArticleChecked: false,
    articleOfAssociationChecked: false,
    boardResolutionChecked: false,
    partnershipPhotosChecked: false,
    partnershipDeedChecked: false,
    authorityLetterChecked: false,
    proprietorPhotosChecked: false,
    addressProofFirmChecked: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'customerType') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        ...clearOtherDocuments(value),
      }));
    } else if (type === 'checkbox' && name.endsWith('Checked')) {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const clearOtherDocuments = (selectedType) => {
    const resetState = {};
    if (selectedType !== 'INDIVIDUAL') {
      resetState.pan = null;
      resetState.passportSizePhotos = null;
      resetState.voterId = null;
      resetState.passport = null;
      resetState.rationCard = null;
      resetState.drivingLicense = null;
      resetState.bankAttestedSignature = null;
      resetState.panChecked = false;
      resetState.passportSizePhotosChecked = false;
      resetState.voterIdChecked = false;
      resetState.passportChecked = false;
      resetState.rationCardChecked = false;
      resetState.drivingLicenseChecked = false;
      resetState.bankAttestedSignatureChecked = false;
    }
    if (selectedType !== 'COMPANY') {
      resetState.authorizedPersonPhotos = null;
      resetState.memorandumOfArticle = null;
      resetState.articleOfAssociation = null;
      resetState.boardResolution = null;
      resetState.authorizedPersonPhotosChecked = false;
      resetState.memorandumOfArticleChecked = false;
      resetState.articleOfAssociationChecked = false;
      resetState.boardResolutionChecked = false;
    }
    if (selectedType !== 'PARTNERSHIP') {
      resetState.partnershipPhotos = null;
      resetState.partnershipDeed = null;
      resetState.authorityLetter = null;
      resetState.partnershipPhotosChecked = false;
      resetState.partnershipDeedChecked = false;
      resetState.authorityLetterChecked = false;
    }
    if (selectedType !== 'PROPRIETORSHIP') {
      resetState.proprietorPhotos = null;
      resetState.addressProofFirm = null;
      resetState.proprietorPhotosChecked = false;
      resetState.addressProofFirmChecked = false;
    }
    return resetState;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle form submission logic here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#272727] p-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-4xl bg-white p-6 md:p-10 rounded-2xl shadow-lg flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-center mb-0">BBA RECORD</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column - Customer Info */}
          <div className="space-y-4">
            <div>
              <label>Customer ID</label>
              <input
                type="text"
                name="custId"
                value={formData.custId}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
              />
            </div>
            <div>
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
              />
            </div>
            <div>
              <label>Mobile No.</label>
              <input
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
              />
            </div>
            <div>
              <label>Document Status</label>
              <input
                type="text"
                name="documentstatus"
                value={formData.documentstatus || ''}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
              />
            </div>

            {/* Customer Type Radio Buttons */}
            <div>
              <label className="text-green-600 text-xl">Customer is :</label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="customerType"
                    value="INDIVIDUAL"
                    checked={formData.customerType === 'INDIVIDUAL'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-blue-800">AN INDIVIDUAL</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="customerType"
                    value="COMPANY"
                    checked={formData.customerType === 'COMPANY'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-blue-800">A COMPANY</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="customerType"
                    value="PARTNERSHIP"
                    checked={formData.customerType === 'PARTNERSHIP'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-blue-800">A PARTNERSHIP FIRM</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="customerType"
                    value="PROPRIETORSHIP"
                    checked={formData.customerType === 'PROPRIETORSHIP'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-blue-800">A PROPRIETORSHIP FIRM</span>
                </label>
              </div>
            </div>
            <div>
              <label>BBA Status:</label>
              <select
                name="bbaStatus"
                value={formData.bbaStatus}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-200 text-black rounded"
              >
                <option value="NA">NA</option>
                {/* Add other options if needed */}
              </select>
            </div>
            <div>
              <label>Given to Customer</label>
              <input
                type="date"
                name="givenToDate"
                value={formData.givenToDate}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-200 text-black rounded"
              />
            </div>
            <div>
              <label>Execution Date</label>
              <input
                type="date"
                name="executionDate"
                value={formData.executionDate}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-200 text-black rounded"
              />
            </div>
          </div>

          {/* Right Column - Name, Phone, Return, Documents, and Remarks */}
          <div className="space-y-4">
            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
              />
            </div>
            <div>
              <label>Phone No</label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
              />
            </div>
            <div>
              <label>Return (By Customer)</label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
              />
            </div>

            <div>
              <label>Document Received on</label>
              <input
                type="date"
                name="documentReceivedDate"
                value={formData.documentReceivedDate}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
              />
            </div>

            {/* Dynamic Document Fields based on Customer Type */}
            {formData.customerType === 'INDIVIDUAL' && (
              <>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="panChecked"
                      checked={formData.panChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    A: Pan no:
                  </label>
                  <input
                    type="file"
                    name="pan"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="passportSizePhotosChecked"
                      checked={formData.passportSizePhotosChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    B: Passport Size Photo
                  </label>
                  <input
                    type="file"
                    name="passportSizePhotos"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="addressProofChecked"
                      checked={formData.addressProofChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    C: Address Proof
                  </label>
                  <input
                    type="file"
                    name="passportSizePhotos"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="voterIdChecked"
                      checked={formData.voterIdChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    D: Voter ID
                  </label>
                  <input
                    type="file"
                    name="voterId"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="passportChecked"
                      checked={formData.passportChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    E: Passport
                  </label>
                  <input
                    type="file"
                    name="passport"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rationCardChecked"
                      checked={formData.rationCardChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    F: Ration Card
                  </label>
                  <input
                    type="file"
                    name="rationCard"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="drivingLicenseChecked"
                      checked={formData.drivingLicenseChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    G: Driving License
                  </label>
                  <input
                    type="file"
                    name="drivingLicense"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="bankAttestedSignatureChecked"
                      checked={formData.bankAttestedSignatureChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    H: Bank Attested Signature
                  </label>
                  <input
                    type="file"
                    name="bankAttestedSignature"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
              </>
            )}
            {formData.customerType === 'COMPANY' && (
              <>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="authorizedPersonPhotosChecked"
                      checked={formData.authorizedPersonPhotosChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    A: Passport Size Photo of Authorised Person
                  </label>
                  <input
                    type="file"
                    name="authorizedPersonPhotos"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="memorandumOfArticleChecked"
                      checked={formData.memorandumOfArticleChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    B: Memorandum of Article
                  </label>
                  <input
                    type="file"
                    name="memorandumOfArticle"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="articleOfAssociationChecked"
                      checked={formData.articleOfAssociationChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    C: Article of Association
                  </label>
                  <input
                    type="file"
                    name="articleOfAssociation"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="boardResolutionChecked"
                      checked={formData.boardResolutionChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    D: Board Resolution
                  </label>
                  <input
                    type="file"
                    name="boardResolution"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
              </>
            )}
            {formData.customerType === 'PARTNERSHIP' && (
              <>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="partnershipPhotosChecked"
                      checked={formData.partnershipPhotosChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    A: Passport Size Photos of Authorised Partner
                  </label>
                  <input
                    type="file"
                    name="partnershipPhotos"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="partnershipDeedChecked"
                      checked={formData.partnershipDeedChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    B: Partnership Deed
                  </label>
                  <input
                    type="file"
                    name="partnershipDeed"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="authorityLetterChecked"
                      checked={formData.authorityLetterChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    C: Authority Letter
                  </label>
                  <input
                    type="file"
                    name="authorityLetter"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
              </>
            )}
            {formData.customerType === 'PROPRIETORSHIP' && (
              <>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="proprietorPhotosChecked"
                      checked={formData.proprietorPhotosChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    A: Passport Size Photos of Proprietor
                  </label>
                  <input
                    type="file"
                    name="proprietorPhotos"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="addressProofFirmChecked"
                      checked={formData.addressProofFirmChecked}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    B: Address Proof of Firm
                  </label>
                  <input
                    type="file"
                    name="addressProofFirm"
                    onChange={handleFileChange}
                    className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
                  />
                </div>
              </>
            )}
            <div>
              <label>Remarks</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-200 text-black rounded focus:ring-2 focus:outline-none focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white rounded-md hover:bg-green-700 font-bold py-2 px-4 rounded mt-4"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default BBAForm;