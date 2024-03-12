import React, { useState } from "react";
import HamburguerIcon from "../HamburguerIcon";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import bitmoji from "../../../public/images/bitmoji.png";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";

const NavbarMobile = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Si el menú se abre, bloquea el scroll
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  return (
    <div className="md:hidden z-10 absolute top-7 right-8 text-white">
      <HamburguerIcon
        isOpen={isOpen}
        toggleMenu={toggleMenu}
        className="border-blue-500 border-4"
      />
      <div
        className={`${
          isOpen ? "right-0" : "-right-full"
        } md:hidden bg-black  min-h-screen w-full fixed top-0 transition-all duration-500 borer-2`}
      >
        <div className="flex justify-between items-start p-4">
          <div className="flex gap-3 items-start">
            <Image src={bitmoji} alt="Randy Grullon" width={25} height={25} />
            <h1 className="text-xl font-bold text-white ">Randy Grullon</h1>
          </div>
        </div>
        <ul className="flex flex-col items-center text-xl justify-center gap-2 px-14 pt-40">
          {menuItems.map((item, index) => (
            <div
              onClick={toggleMenu}
              key={index}
              className=" border-2 px-5 py-5 w-full h-24 flex flex-col justify-center capitalize text-3xl"
            >
              <div className="flex justify-between items-center">
                <li>{item.label}</li>
                <FontAwesomeIcon icon={faCircleArrowLeft} />
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavbarMobile;
