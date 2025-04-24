import React from "react";

const cardsData = [
  {
    id: "card_1",
    title: "CONNECTIVITY",
    texts: [
      "5Km. from Delhi (Tikri Border)",
      "Located on NH-9",
      "5 Minutes drive from KMP Expressway",
      "KMP Connects NH-1, NH-8 and NH-9",
      "20 Minutes from Peeragarhi",
      "45 Minutes from Delhi Airport",
      "5 Minutes from Sector-6, Metro Station",
    ],
    image: "https://hlcity.in/images/metro.jpg",
  },
  {
    id: "card_2",
    title: "WORLD CLASS AMENITIES",
    texts: [
      "World Class Badminton Academy",
      "Open Air Gyms",
      "Cycling Track",
      "Obstacle Course",
      "Hospital",
      "Running Track",
      "Indoor Gym",
      "Indoor All Weather Swimming Pool",
    ],
    image: "https://hlcity.in/images/gym.jpg",
  },
  {
    id: "card_3",
    title: "24x7 SECURITY",
    texts: [
      "Gated Community",
      "CCTV coverage of Roads",
      "Security Guards",
      "Police post within Campus",
    ],
    image: "https://hlcity.in/images/security.jpg",
  },
  {
    id: "card_4",
    title: "AESTHETICALLY DESIGNED COMMON AREAS",
    texts: [
      "Metalled Roads",
      "Granite Parking Slots",
      "Terrace Pavements",
      "Open Parks",
    ],
    image: "https://hlcity.in/images/openpark.jpg",
  },
  {
    id: "card_5",
    title: "QUALITY CONSTRUCTION",
    texts: [
      "Inhouse construction agency",
      "Material Sourced from Top Manufacturers directly",
      "Designs & material at par with International Standards",
    ],
    image: "https://hlcity.in/images/construction.jpg",
  },
];

const Card = ({ card, isLast }) => {
  return (
    <li
      className={`sticky top-20 ${isLast ? "mb-0" : ""}`}
      id={card.id}
      style={{ zIndex: 1 }} // helps ensure each card overlaps the previous on scroll
    >
      {/* 
        For mobile: single column (text on top, image below, auto height).
        For larger screens (md+): 2 columns, fixed 500px height. 
      */}
      <div
        className="
          shadow-lg bg-white text-gray-900 rounded-xl overflow-hidden
          grid grid-cols-1 md:grid-cols-2
          md:h-[500px]  /* only fix the height on md+ */
        "
      >
        {/* Text section */}
        <div
          className="
            p-8 flex flex-col items-center justify-center text-center
            space-y-4
            order-1  /* on mobile, text is first */
            md:order-1 /* on larger screens, keep text in first column */
          "
        >
          <h2 className="text-2xl font-bold text-black">{card.title}</h2>
          {card.texts.map((text, i) => (
            <p key={i} className="font-light">
              {text}
            </p>
          ))}
          <p className="mt-8">
            <a
              href="#top"
              className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition"
            >
              Read more
            </a>
          </p>
        </div>

        {/* Image section */}
        <figure
          className="
            order-2 md:order-2
            overflow-hidden
          "
        >
          <img
            src={card.image}
            alt="Image description"
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
          />
        </figure>
      </div>
    </li>
  );
};

const CardsList = () => {
  return (
    <div className="bg-[#252525] text-white text-center">
      {/* Sticky header that stays at the top */}
      <h1 className="text-2xl md:text-5xl font-semibold text-center p-8 tracking-wide" id="top">
        A few reasons to live in HL City, Bahadurgarh
      </h1>

      <main className="w-[80vw] mx-auto mb-8 pt-4">
        <ul id="cards" className="list-none grid gap-4 pb-16">
          {cardsData.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              isLast={index === cardsData.length - 1}
            />
          ))}
        </ul>
      </main>
    </div>
  );
};

export default CardsList;
