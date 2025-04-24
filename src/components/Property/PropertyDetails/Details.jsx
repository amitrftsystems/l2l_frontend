import { Star } from "lucide-react";
import "swiper/css";
import ImageSection from "./ImageSection";
import VedioSection from "./VedioSection";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  propertyData,
  amentities,
  areaDetails,
  Features,
  tenant,
  bookNow,
  agent,
} from "./PDetails";
import Spinner from "../../utils/Spinner";

import {
  Building2,
  Users,
  ParkingSquare,
  BatteryCharging,
  ShieldCheck,
  ShoppingCart,
  Wifi,
  Flame,
  Wind,
  Phone,
  Droplet,
  Home,
  Trees,
  Recycle,
  Waves,
  Brush,
  Baby,
} from "lucide-react";

const amenitiesList = [
  { key: "Lift", icon: <Building2 size={24} color="gray" /> },
  { key: "Servant Room", icon: <Users size={24} color="gray" /> },
  { key: "Visitor Parking", icon: <ParkingSquare size={24} color="gray" /> },
  { key: "Power Backup", icon: <BatteryCharging size={24} color="gray" /> },
  { key: "Fire Safety", icon: <ShieldCheck size={24} color="gray" /> },
  { key: "Shopping Center", icon: <ShoppingCart size={24} color="gray" /> },
  { key: "Internet Services", icon: <Wifi size={24} color="gray" /> },
  { key: "Gas Pipeline", icon: <Flame size={24} color="gray" /> },
  { key: "Air Conditioner", icon: <Wind size={24} color="gray" /> },
  { key: "Intercom", icon: <Phone size={24} color="gray" /> },
  { key: "Rain Water Harvesting", icon: <Droplet size={24} color="gray" /> },
  { key: "Club House", icon: <Home size={24} color="gray" /> },
  { key: "Park", icon: <Trees size={24} color="gray" /> },
  { key: "Sewage Treatment Plant", icon: <Recycle size={24} color="gray" /> },
  { key: "Swimming Pool", icon: <Waves size={24} color="gray" /> },
  { key: "House Keeping", icon: <Brush size={24} color="gray" /> },
  { key: "Children Play Area", icon: <Baby size={24} color="gray" /> },
];

// Helper function to check for null or empty string
const isValid = (value) => value != null && value.toString().trim() !== "";

const Details = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/getPropertyById/${id}`
        );
        const data = await response.json();
        setProperty(data.data);
      } catch (error) {
        console.error("Error fetching property details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-20">
        <Spinner />
      </div>
    );
  if (!property)
    return (
      <div className="text-center mt-20 text-red-600">Property not found!</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 bg-white">
      <ImageSection images={property.images} />
      {/* Two-column layout for description & reservation card */}
      <div className="mt-6 md:flex md:space-x-6">
        {/* LEFT COLUMN: Description */}
        <div className="md:w-2/3">
          {/* Title and Description */}
          <h1 className="text-lg md:text-2xl font-bold mt-2">
            {propertyData.Title}
          </h1>
          <h1 className="text-sm md:text-md mt-2">{property.propertyUnique}</h1>

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

          {/* Amenities Section */}
          <div className="mt-4">
            <h2 className="text-md font-semibold">AMENITIES</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
              {amenitiesList
                .filter((item) => amentities[item.key] === 1)
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1 bg-gray-200 p-2 rounded-lg shadow transform hover:scale-105 transition duration-300 ease-in-out"
                  >
                    {item.icon}
                    <span className="text-gray-700 text-xs md:text-sm">
                      {item.key}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="p-4">
            <h2 className="text-md font-semibold">PROPERTY VEDIOS</h2>
            <VedioSection />
          </div>

          {/* Rating */}
          <div className="flex items-center mt-2 text-yellow-500">
            <span className="text-lg font-semibold mr-1">4.94</span>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
            <span className="text-sm text-gray-600 ml-2">392 reviews</span>
          </div>
        </div>
        {/* RIGHT COLUMN: Reservation Card & Agent Info */}
        <div className="mt-6 md:mt-0 md:w-1/3 md:flex md:flex-col">
          {/* Reservation Card */}
          <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold">{bookNow.price}</span>
              <span className="text-sm text-gray-500">
                Monthly Maintainance: {bookNow.monthlyMaintainance}
              </span>
            </div>

            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Expected Deposit</span>
                <span>{bookNow.expectedDeposit}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per Square ft </span>
                <span>{bookNow.priceperSqauare}</span>
              </div>
              <div className="flex justify-between">
                <span>Price Negotiable </span>
                <span>{bookNow.priceNegotiable}</span>
              </div>

              <div className="flex justify-between font-semibold">
                <span>Total before taxes</span>
                <span>₹ 1.5 Cr</span>
              </div>
            </div>

            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md">
              Book Appointment
            </button>
          </div>

          <div className="mt-10 border border-gray-300 rounded-lg p-4 shadow-sm bg-white relative">
            {/* Circle Image on the Top Left */}
            <div className="absolute -top-6 left-4 w-15 h-15 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src={agent.profilephoto}
                alt="Property"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between mt-6">
              <span className="text-xl font-semibold">{agent.agentName}</span>
              <span className="text-sm text-gray-500">{agent.TeamName}</span>
            </div>

            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>PhoneNumber 1</span>
                <span>{agent.PhoneNumber1}</span>
              </div>
              <div className="flex justify-between">
                <span>PhoneNumber 2</span>
                <span>{agent.PhoneNumber2}</span>
              </div>

              <div className="flex justify-between font">
                <span>Email</span>
                <span>{agent.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Availability</span>
                <span>{agent.availability}</span>
              </div>
              <div className="flex justify-between">
                <span>TimeSchedule</span>
                <span>{agent.TimeSchedule}</span>
              </div>
            </div>

            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md">
              Contact Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
