import React from "react";

const HamburgerButton = ({ toggleMenu, isOpen }) => {
  return (
      <button
        className="flex absolute z-50 top-0 right-0 items-center space-x-2 focus:outline-none"
        onClick={toggleMenu}
      >
        <div className="w-6 flex items-center justify-center relative">
          <span
            className={`transform transition w-full h-px bg-current absolute ${
              isOpen ? "translate-y-0 rotate-45" : "-translate-y-2"
            }`}
          ></span>

          <span
            className={`transform transition w-full h-px bg-current absolute ${
              isOpen ? "opacity-0 translate-x-3" : "opacity-100"
            }`}
          ></span>

          <span
            className={`transform transition w-full h-px bg-current absolute ${
              isOpen ? "translate-y-0 -rotate-45" : "translate-y-2"
            }`}
          ></span>
        </div>
      </button>
  );
};

export default HamburgerButton;
