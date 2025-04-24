import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { IoIosArrowRoundDown } from "react-icons/io";

const MarketAnalysisCard = ({ image, title, delay }) => {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="flex items-center bg-white mt-5 rounded-full p-4 w-full max-w-[300px] md:max-w-[550px] shadow-lg"
    >
      <img
        src={image}
        alt={title}
        className="w-15 h-15 rounded-full mr-4 object-cover"
      />
      <div className="text-black font-semibold text-sm md:text-lg">
        {title}
      </div>
      <motion.div className="ml-auto text-black text-lg">
        <IoIosArrowRoundDown size={40} />
      </motion.div>
    </motion.div>
  );
};

const BottomScrollingText = () => {
  return (
    // Hide on smaller screens; display (flex) on md+
    <div className="hidden md:flex absolute bottom-5 w-full overflow-hidden space-x-10 px-4">
      {/* Scrolling Text #1 */}
      <motion.div
        initial={{ x: "100vw" }}
        animate={{ x: "-100vw" }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="text-[#252525] bg-white/25 text-3xl md:text-5xl font-normal rounded-full px-8 py-4 whitespace-nowrap"
      >
        100% transparency
      </motion.div>

      {/* Scrolling Text #2 */}
      <motion.div
        initial={{ x: "100vw" }}
        animate={{ x: "-100vw" }}
        transition={{
          duration: 6,
          repeat: Infinity,
          delay: 1.5,
          ease: "linear",
        }}
        className="text-[#252525] bg-white/25 text-3xl md:text-5xl font-normal rounded-full px-8 py-4 whitespace-nowrap"
      >
        Elite Services
      </motion.div>
    </div>
  );
};

export default function RealEstateComponent() {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  return (
    <div className="relative min-h-screen bg-[#252525] text-white">
      {/* Container for spacing */}
      <div className="px-6 py-8 h-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 h-full w-full">
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="md:w-1/2"
          >
            <h1 className="font-sans text-3xl md:text-5xl font-light leading-tight">
              Tailored Solutions <br /> for Your Real Estate
              <br /> Needs
            </h1>
            <div className="mt-4 flex items-center space-x-2">
              <span className="h-2 w-2 bg-blue-400 rounded-full"></span>
              <a href="#" className="text-sm md:text-lg underline">
                Explore More →
              </a>
            </div>
          </motion.div>

          {/* Right Section (Market Analysis Cards) */}
          <motion.div
            ref={ref}
            className="md:w-1/2 flex flex-col items-start md:items-end"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            <MarketAnalysisCard
              image="/real1.jpg"
              title="Market Analysis"
              delay={0.2}
            />
            <MarketAnalysisCard
              image="/real2.jpg"
              title="Property Valuation Analysis"
              delay={0.4}
            />
            <MarketAnalysisCard
              image="/real3.jpg"
              title="Investment Analysis"
              delay={0.6}
            />
            <MarketAnalysisCard
              image="/real4.jpg"
              title="Neighbourhood & Demographic Analysis"
              delay={0.8}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom Scrolling Text (Hidden on mobile) */}
      <BottomScrollingText />
    </div>
  );
}
