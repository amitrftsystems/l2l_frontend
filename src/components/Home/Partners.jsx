import { motion } from "framer-motion";

const partners = [
  { name: "DAMAC", logo: "/brand-logo/logo1.jpg" },
  { name: "EMAAR", logo: "/brand-logo/logo2.jpg" },
  { name: "NAKHEEL", logo: "/brand-logo/logo3.jpg" },
  { name: "SOBHA", logo: "/brand-logo/logo4.jpg" },
];

const PartnersCarousel = () => {
  return (
    <div className="bg-white py-10 overflow-hidden">
      <h2 className="text-center text-2xl font-semibold mb-6">
        Our Valued Partners
      </h2>
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex space-x-16 flex-nowrap w-max"
          animate={{
            x: ["0%", "-100%"], // Moves from start to end smoothly
          }}
          transition={{
            repeat: Infinity,
            duration: 500, // Adjust the scrolling speed
            ease: "linear",
          }}
        >
          {Array.from({ length: 100 })
            .flatMap(() => partners)
            .map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center min-w-[200px]"
              >
                {/* 
                  Smaller logo for mobile:
                    h-16, max-h-20
                  Original/larger size restored at md and above:
                    md:h-24, md:max-h-32
                */}
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-16 w-auto max-h-20 md:h-24 md:max-h-32"
                />
              </div>
            ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PartnersCarousel;
