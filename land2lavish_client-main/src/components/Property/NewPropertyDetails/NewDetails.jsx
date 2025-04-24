import "swiper/css";

import { propertyData, areaDetails, Features, tenant } from "./Details";

// Helper function to check for null or empty string
const isValid = (value) => value != null && value.toString().trim() !== "";

const Details = () => {
  return (
    <div
      className="max-w-5xl mx-auto p-4 md:p-6 bg-white"
      style={{ marginTop: "-450px" }}
    >
      {/* Two-column layout for description & reservation card */}
      <div className="mt-6 md:flex md:space-x-6">
        {/* LEFT COLUMN: Description */}
        <div className="md:w-2/3">
          {/* Subheading with Features */}
          <p className="text-sm text-gray-600 mt-3 border-b mb-3 border-gray-300 pb-2">
            {Features.Bedroom} bedroom • {Features.Bathroom} bathroom •{" "}
            {Features.Balcony} balcony • {Features.Kitchen} kitchen
          </p>

          {/* Property Details */}
          <div>
            <h2 className="text-MD font-semibold">PROPERTY DETAILS</h2>
            <div className="grid text-gray-800 text-xs md:text-sm font-primary font-secondary grid-cols-2 gap-2 p-2">
              {isValid(propertyData.PropertyType) && (
                <p>Property Type : {propertyData.PropertyType}</p>
              )}
              {isValid(propertyData.BHKType) && (
                <p>BHK Type : {propertyData.BHKType}</p>
              )}
              {isValid(propertyData.Floor) && (
                <p>Floor : {propertyData.Floor}</p>
              )}
              {isValid(propertyData.TotalFloors) && (
                <p>Total Floors in Building : {propertyData.TotalFloors}</p>
              )}
              {isValid(propertyData.PropertyAge) && (
                <p>Property Age : {propertyData.PropertyAge}</p>
              )}
              {isValid(propertyData.Furnishing) && (
                <p>Furnishing : {propertyData.Furnishing}</p>
              )}
              {isValid(propertyData.Ownership) && (
                <p>Ownership : {propertyData.Ownership}</p>
              )}
              {isValid(propertyData.PropertyAuthority) && (
                <p>Property Authority : {propertyData.PropertyAuthority}</p>
              )}
            </div>
          </div>

          {/* Area Details */}
          <div className="mt-2">
            <h2 className="text-md font-semibold">AREA DETAILS</h2>
            <div className="grid text-gray-800 text-xs md:text-sm font-primary font-secondary grid-cols-2 gap-2 p-2">
              {isValid(Features.Bedroom) && <p>Bedroom : {Features.Bedroom}</p>}
              {isValid(areaDetails.lengthOfPlot) && (
                <p>Length of Plot : {areaDetails.lengthOfPlot}</p>
              )}
              {isValid(areaDetails.breadthOfPlot) && (
                <p>Breadth of Plot : {areaDetails.breadthOfPlot}</p>
              )}
              {isValid(areaDetails.widthOfFacingRoad) && (
                <p>Width of Facing Road : {areaDetails.widthOfFacingRoad}</p>
              )}
              {isValid(areaDetails.numberOfOpenSides) && (
                <p>Number of Open Sides : {areaDetails.numberOfOpenSides}</p>
              )}
              {isValid(areaDetails.constructionDone) && (
                <p>Construction Done : {areaDetails.constructionDone}</p>
              )}
              {isValid(areaDetails.breadthOfPlot) && (
                <p>Property Facing : {areaDetails.breadthOfPlot}</p>
              )}
            </div>
          </div>

          {/* Tenant Preferences */}
          <div className="mt-2">
            <h2 className="text-md font-semibold">TENANT PREFERENCES</h2>
            <div className="grid text-gray-800 text-xs md:text-sm font-primary font-secondary grid-cols-2 gap-2 p-2">
              <p>Preferred Tenants : {tenant["Preferred Tenants"]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
