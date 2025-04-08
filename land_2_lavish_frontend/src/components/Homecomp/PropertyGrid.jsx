
const properties = [
  {
    id: 1,
    title: "Luxury Villas",
    img: "p1.jpg",
    size: "col-span-1 row-span-1 row-start-1 row-end-1 col-start-1 translate-y-30 translate-x-30",
  },
  {
    id: 2,
    title: "Penthouse Suites",
    img: "p2.jpg",
    size: "col-span-1 row-start-1 translate-x-30",
  },
  {
    id: 3,
    title: " ",
    img: "hlcitylogo.jpg",
    size: "col-span-1 row-start-1 -translate-y-20 translate-x-30",
  },
  {
    id: 4,
    title: "Beachfront Properties",
    img: "p4.jpg",
    size: "col-span-1 row-span-1 row-start-1 translate-x-30",
  },
  {
    id: 5,
    title: "Golf Course Residences",
    img: "p5.jpg",
    size: "col-span-1 row-start-1 translate-y-30 translate-x-30",
  },
  {
    id: 6,
    title: "Commercial Spaces",
    img: "p6.jpg",
    size: "col-span-1 row-span-1 row-start-2 translate-y-30 translate-x-30",
  },
  {
    id: 7,
    title: "Townhouses",
    img: "real1.jpg",
    size: "col-span-1 row-span-1 row-start-2 translate-x-30",
  },
  {
    id: 8,
    title: "Waterfront Homes",
    img: "real2.jpg",
    size: "col-span-1 row-span-1 row-start-2 translate-x-30 -translate-y-20",
  },
  {
    id: 9,
    title: "Holiday Homes",
    img: "real3.jpg",
    size: "col-span-1 row-start-2 translate-x-30",
  },
  {
    id: 10,
    title: "Investment",
    img: "p1.jpg",
    size: "col-span-1 row-span-1 row-start-2 translate-y-30 translate-x-30",
  },
  {
    id: 11,
    title: "Eco-friendly Properties",
    img: "p2.jpg",
    size: "col-span-1 row-span-1 row-start-3 translate-x-212",
  },
  {
    id: 12,
    title: "Desert Retreats",
    img: "p3.jpg",
    size: "col-span-1 row-span-1 row-start-3 translate-x-30",
  },
  {
    id: 13,
    title: "Apartments",
    img: "p3.jpg",
    size: "col-span-1 row-span-1 row-start-3 translate-x-30 -translate-y-15",
  },
];

const PropertyGrid = () => {
  return (
    <div className="mx-1 p-10 bg-gray-100">
      {/* Grid Container */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-4 auto-rows-[180px] md:auto-rows-[250px] my-40 -translate-x-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className={`relative rounded-xl overflow-hidden shadow-lg ${
              property.id !== 13 ? "group" : ""
            } ${property.size}`}
          >
            {/* ✅ Image Wrapper with Conditional Hover Effect */}
            <div className="w-full h-full overflow-hidden">
              <img
                src={`/${property.img}`}
                alt={property.title}
                className={`w-full h-full object-cover transition-transform duration-500 ease-in-out ${
                  property.id !== 13 ? "group-hover:scale-110" : ""
                }`}
              />
            </div>

            {/* ✅ Overlay & Title */}
            <div
              className={`absolute inset-0 bg-opacity-30 ${
                property.id !== 13
                  ? "group-hover:bg-opacity-50 transition-all duration-300"
                  : ""
              } flex items-end p-4`}
            >
              <h3 className="text-white text-lg font-semibold">
                {property.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid;
