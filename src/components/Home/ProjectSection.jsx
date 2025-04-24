import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Projects from "./mainHead/Projects";

function ProjectsSection() {
  // Create a reference to track when this section comes into view
  const ref = useRef(null);
  const isInView = useInView(ref, { triggerOnce: true, threshold: 0.5 });

  return (
    <div
      ref={ref}
      className="min-h-screen text-white py-[40px] px-6"
      style={{ backgroundColor: "#252525" }}
    >
      {/* Animated Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }} // Start off-screen
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} // Animate only when in view
        transition={{ duration: 2, ease: "easeOut" }} // Smooth transition
        className="text-4xl md:text-6xl font-bold text-center mb-1"
      >
        Explore Our Offerings
      </motion.h1>

      <Projects />
    </div>
  );
}

export default ProjectsSection;
