import React, { useState } from "react";
import HamburguerIcon from "../HamburguerIcon";

const NavbarMobile = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="md:hidden relative">
      <HamburguerIcon
        isOpen={isOpen}
        toggleMenu={toggleMenu}
        className="border-blue-500 border-4 "
      />
      <div
        className={`${
          isOpen ? "right-0" : "-right-full"
        } md:hidden bg-black  h-screen w-full fixed top-0 transition-all duration-500`}
      >
        <ul className="flex flex-col items-center text-xl border-blue-500 border-4 justify-center h-full gap-10">
          {menuItems.map((item, index) => (
            <li key={index} onClick={item.onClick}>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavbarMobile;
