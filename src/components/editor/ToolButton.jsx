import React from 'react';

const ToolButton = React.forwardRef(({ onClick, isActive, title, children, className = '' }, ref) => (
  <button
    onClick={onClick}
    className={`p-1.5 relative text-gray-600 dark:text-gray-300 hover:text-gray-500 transition-colors duration-200 ${className}`}
    title={title}
    ref={ref}
  >
    {children}
    <span
      className={`absolute bottom-0 left-0 w-full h-0.5 bg-gray-500 transform ${
        isActive ? 'scale-x-100' : 'scale-x-0'
      } origin-center transition-transform duration-200`}
    />
  </button>
));

export default ToolButton;