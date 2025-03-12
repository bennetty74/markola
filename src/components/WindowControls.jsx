// src/components/WindowControls.jsx
import React from 'react';
import { MinusIcon, XMarkIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";

const WindowControls = ({ minimizeWindow, maximizeWindow, closeWindow }) => {
  return (
    <div className="flex items-center gap-2" style={{ WebkitAppRegion: "no-drag" }}>
      <button
        onClick={minimizeWindow}
        className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 focus:outline-none flex items-center justify-center"
        title="Minimize"
      >
        <MinusIcon className="w-2 h-2 text-gray-800 opacity-0 hover:opacity-100 transition-opacity duration-150" />
      </button>
      <button
        onClick={maximizeWindow}
        className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 focus:outline-none flex items-center justify-center"
        title="Maximize/Restore"
      >
        <ChevronUpDownIcon className="w-2 h-2 text-gray-800 opacity-0 hover:opacity-100 transition-opacity duration-150 rotate-45" />
      </button>
      <button
        onClick={closeWindow}
        className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 focus:outline-none flex items-center justify-center"
        title="Close"
      >
        <XMarkIcon className="w-2 h-2 text-gray-800 opacity-0 hover:opacity-100 transition-opacity duration-150" />
      </button>
    </div>
  );
};

export default WindowControls;