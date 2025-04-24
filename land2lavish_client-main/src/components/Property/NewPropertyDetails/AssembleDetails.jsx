import React from "react";
import BuildingImageHolder from "./BuildingImageHolder";
import PropertyNavbar from "./PropertyNavbar";
import Description from "./Description";
import Gallery from "./Gallery";
import VedioSection from "./VedioSection";
import Details from "./NewDetails";
import PaymentPlan from "./PaymentPlan";
import Brochure from "./Brochure";
import Location from "./Location";
import Amenity from "./Amenity";
import FloorPlan from "./FloorPlan";

const AssembleDetails = () => {
  return (
    <div>
      <BuildingImageHolder />
      <div className="mt-6 border-b-2 border-gray-50">
        <PropertyNavbar />
      </div>

      <section id="detail">
        <Description />
      </section>

      <section id="gallery" className="ml-20 py-10">
        <Gallery className="w-full h-full object-cover" />
      </section>

      <section id="amenities">
        <Amenity />
      </section>

      <section id="floor-plans">
        <FloorPlan />
      </section>

      <section id="payment-plan">
        <PaymentPlan />
      </section>

      <section id="brochure">
        <Brochure />
      </section>

      <section id="location">
        <Location />
      </section>
    </div>
  );
};

export default AssembleDetails;
