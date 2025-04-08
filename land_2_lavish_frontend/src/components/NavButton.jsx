import { motion } from "framer-motion";
const NavButton = ({ onClick, children, className, disabled, formData }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 m-2 rounded ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  );
};

export default NavButton;
