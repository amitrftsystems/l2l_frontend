import React from "react";
import PropTypes from "prop-types";

export const Card = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardContent = ({ children }) => {
  return <div className="p-2">{children}</div>;
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};
