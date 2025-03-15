import React from 'react';

const Dropdown = ({ isOpen, children, refProp, className = '' }) => {
  if (!isOpen) return null;
  return (
    <div
      ref={refProp}
      className={`absolute top-full mt-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg z-20 ${className}`}
    >
      {children}
    </div>
  );
};

export default Dropdown;