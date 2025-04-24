import React from "react";
import { Card, CardContent } from "./CardComp";
import { Button } from "./Button";
import { MapPin } from "lucide-react";

const Location = () => {
  const locations = [
    { name: "Bahadurgarh Fort: Fort in Bahadurgarh", time: "19 Mins" },
    { name: "Tau Devi Lal Biodiversity and Botanical Park", time: "15 Mins" },
    { name: "Water Park and Fun Town Amusement", time: "14 Mins" },
    { name: "Omax Kids Park", time: "20 Mins" },
    { name: "Brigadier Hoshiar Singh Metro Station (BHS)", time: "10 Mins" },
    { name: "GD Goenka School", time: "10 Mins" },
  ];

  return (
    <div className="max-w-8xl mx-15 p-10">
      <h2 className="text-2xl font-bold">Connections to the Heart of City </h2>
      <p className="mt-4 text-gray-600">
        HL City is located in a prime spot that offers seamless connectivity to
        the heart of the City.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-6">
        {/* Left - Nearby Locations */}
        <Card className="p-4 shadow-lg">
          <h3 className="text-lg font-semibold">Area Nearby</h3>
          <ul className="mt-2 space-y-2">
            {locations.map((location, index) => (
              <li key={index} className="flex justify-between  py-2">
                <span>{location.name}</span>
                <span className="text-gray-500">{location.time}</span>
              </li>
            ))}
          </ul>
          <Button
            className="mt-4 w-full flex items-center justify-center"
            variant="outline"
          >
            <MapPin className="mr-2" /> View On Map
          </Button>
        </Card>
        {/* Right - Google Map */}
        <div className="overflow-hidden rounded-xl shadow-lg">
          <iframe
            className="w-full h-72 md:h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.6313977313675!2d76.8973565!3d28.6707535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0c12f1a4aac5%3A0x40901c1b30199cb5!2sHL%20City!5e0!3m2!1sen!2sin!4v1739420610003!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Location;
