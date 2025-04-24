// PDetails.js
import image1 from "../../../../public/pro1.jpg";
import image2 from "../../../../public/pro2.jpg";
import image3 from "../../../../public/pro3.jpg";
import image4 from "../../../../public/pro6.jpg";
import image5 from "../../../../public/pro12.jpg";
import image6 from "../../../../public/pro11.jpg";
import image7 from "../../../../public/pro9.jpg";
import vedio1 from "./Images/Vedio1.mp4";
import vedio2 from "./Images/Vedio2.mp4";

export const images = [image1, image2, image3, image4, image5, image7, image6];

export const propertyData = {
  id: 1,
  Title:
    "Fully Furnished 1 BHK House for Rent – Prime Location with Modern Amenities",
  Description:
    "Discover a spacious and fully furnished 1 BHK house available for rent in a prime location. This well-maintained property is 1 to 3 years old and is situated on the ground floor of a 2-story building. The north-west facing home offers ample natural light and ventilation.",
  PropertyType: "House",
  BHKType: "1 BHK",
  Floor: "Ground",
  TotalFloors: "2",
  PropertyAge: "1 to 3 years",
  Furnishing: "Fully Furnished",
  Ownership: "Freehold",
  PropertyAuthority: "Local",
};

export const amentities = {
  Lift: 0,
  "Servant Room": 0,
  "Visitor Parking": 1,
  "Power Backup": 1,
  "Fire Safety": 1,
  "Shopping Center": 0,
  "Internet Services": 1,
  "Gas Pipeline": 1,
  "Air Conditioner": 1,
  Intercom: 1,
  "Rain Water Harvesting": 1,
  "Club House": 1,
  Park: 1,
  "Sewage Treatment Plant": 1,
  "Swimming Pool": 1,
  "House Keeping": 1,
  "Children Play Area": 1,
};

export const areaDetails = {
  totalArea: "1100 sq.ft",
  lengthOfPlot: "45 ft",
  breadthOfPlot: "45 ft",
  widthOfFacingRoad: "58 ft",
  numberOfOpenSides: 2,
  constructionDone: true, // Changed "Yes" to Boolean `true`
  propertyFacing: "North-West",
};

export const Features = {
  Bedroom: 2,
  Bathroom: 2,
  Balcony: 2,
  Kitchen: 1,
};

export const tenant = {
  "Preferred Tenants": "Anyone",
};

export const availability = {
  Possesion: "1 Month",
  availability: "Everyday (Available All Day)",
  "Visiting Time": " 00:00 - 00:00",
};

export const vedios = {
  Vedio1: vedio1,
  Vedio2: vedio2,
};

export const bookNow = {
  price: "₹ 1.5 Cr",
  priceperSqauare: "₹ 15000",
  expectedDeposit: "₹ 30 lakh",
  monthlyMaintainance: "Yes",
  priceNegotiable: "Yes",
};

export const agent = {
  agentName: "Rahul",
  TeamName: "HL City",
  PhoneNumber1: "7986457876",
  PhoneNumber2: "7986457890",
  email: "rahul@halohomes.in",
  availability: "Mon-Fri",
  TimeSchedule: "12:00 - 18:00",
  profilephoto: image1,
};
