import React, { useEffect } from "react";
import { projectsData } from "../../../data/data";
import { Link } from "react-router-dom";

import Container from "./Container";
import { FiArrowUpRight } from "react-icons/fi";

// Import AOS and its styles
import AOS from "aos";
import "aos/dist/aos.css";

function Projects() {
  // Initialize AOS on mount
  useEffect(() => {
    AOS.init({
      duration: 3000, // Global animation duration (in ms)
      once: true,     // Animation should happen only once
    });
  }, []);

  return (
    <div className="bg-lightGray text-white py-[40px]">
      <Container>
        <div className="font-bold">
          <h3 className="text-center uppercase font-bold sm:text-xl text-lg">
            Discover a Broad Range Of Units That Will Suit Your Needs
          </h3>

          {/* 
            Responsive wrapper:
            - Mobile: flex-col, items-center => single-column, centered
            - Desktop: flex-row => original layout
          */}
          <div
            className="
              flex 
              flex-col md:flex-row 
              flex-wrap
              md:items-start items-center 
              gap-[50px] 
              mt-[50px] 
              mx-auto
              md:ml-[200px]
            "
          >
            {projectsData.map((p, index) => {
              const isLastCard = index === projectsData.length - 1;

              return (
                <div
                  data-aos="fade-up"
                  data-aos-duration="3000"
                  key={p.id}
                  className={`
                    bg-[#262626] hover:bg-[#333333] 
                    relative 
                    rounded-3xl 
                    overflow-hidden 
                    group 
                    transition 
                    // Force full width & square on mobile
                    w-full md:w-[calc(40%-15px)] 
                    aspect-square md:aspect-auto
                    min-h-[300px] md:min-h-[400px]
                  `}
                >
                  {/* If it's the last card, show embedded Google Maps */}
                  {isLastCard ? (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.6313977313675!2d76.8973565!3d28.6707535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0c12f1a4aac5%3A0x40901c1b30199cb5!2sHL%20City!5e0!3m2!1sen!2sin!4v1739420610003!5m2!1sen!2sin"
                      className="w-full h-full absolute top-0 left-0"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  ) : (
                    // Otherwise, show the card image
                    <img
                      src={p.image}
                      alt={p.description}
                      className="w-full h-full object-cover absolute top-0 left-0"
                    />
                  )}

                  {/* Explore More Icon (hide on the last card) */}
                  {!isLastCard && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full cursor-pointer hover:bg-opacity-70 transition duration-300">
                      <Link to="/properties">
                        <FiArrowUpRight className="w-5 h-5" />
                      </Link>
                    </div>
                  )}

                  {/* Text Overlay (always visible on mobile, fades out on hover in desktop) */}
                  <div
                    className="
                      absolute bottom-4 left-4 
                      bg-gray-950 bg-opacity-50 
                      text-white px-4 py-1 
                      text-md font-semibold 
                      rounded-lg 
                      transition-all duration-500 
                      opacity-100 md:group-hover:opacity-0
                    "
                  >
                    {p.title}
                  </div>

                  {/* Hidden details on hover (only for non-last cards) */}
                  {!isLastCard && (
                    <div
                      className="
                        absolute 
                        opacity-0 
                        group-hover:opacity-100 
                        transform transition-all duration-500 
                        flex gap-2 p-4 w-full 
                        md:bottom-4 md:left-1/2 md:-translate-x-1/2 
                        md:flex-row md:translate-y-8 group-hover:md:translate-y-0 
                        left-2 top-auto 
                        flex-col gap-y-2
                      "
                    >
                      {/* Price */}
                      <div className="bg-white text-black p-2 rounded-2xl md:w-1/4 w-full max-w-[120px] text-left shadow-lg flex flex-col self-start">
                        <span className="font-primary font-secondary text-xs text-gray-500">
                          Price:
                        </span>
                        <span className="text-xs font-semibold text-black">
                          {p.price}
                        </span>
                      </div>

                      {/* Installment Plan */}
                      <div className="bg-white text-black p-2 rounded-2xl md:w-1/4 w-full max-w-[120px] text-left shadow-lg flex flex-col self-start">
                        <span className="font-primary font-secondary text-xs text-gray-500">
                          Installment Plan:
                        </span>
                        <span className="text-xs font-semibold text-black">
                          {p.InstallmentPan}
                        </span>
                      </div>

                      {/* Initial Payment */}
                      <div className="bg-white text-black p-2 rounded-2xl md:w-1/4 w-full max-w-[120px] text-left shadow-lg flex flex-col self-start">
                        <span className="font-primary font-secondary text-xs text-gray-500">
                          Initial Payment:
                        </span>
                        <span className="text-xs font-semibold text-black">
                          {p.InitialPayment}
                        </span>
                      </div>

                      {/* Features */}
                      <div className="bg-white text-black p-2 rounded-2xl md:w-1/4 w-full max-w-[120px] text-left shadow-lg flex flex-col self-start">
                        <span className="font-primary font-secondary text-xs text-gray-500">
                          Features:
                        </span>
                        <span className="text-xs font-semibold text-black">
                          {p.UpgradedFeatures}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Projects;
