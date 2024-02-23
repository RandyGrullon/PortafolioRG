import React, { useState } from "react";
import HamburguerIcon from "../HamburguerIcon";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav
        className={`p-5 md:p-10 bg-black bg-opacity-50 ${
          isMenuOpen ? "rounded-tr-3xl rounded-tl-3xl " : "rounded-full"
        } md:rounded-full border-fuchsia-900 border-2 px-4 py-2 text-white flex flex-row md:flex-row justify-between items-center relative`}
      >
        {/* Nombre */}
        <h1 className="text-2xl md:text-3xl poppins-bold">Randy Grullon</h1>

        {/* Menú desplegable solo en dispositivos móviles */}
        <div className="md:hidden">
          <HamburguerIcon toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} /> {/* Pasamos el estado de isMenuOpen como prop */}

          {/* Movemos el menú aquí debajo */}
        </div>

        {/* Opciones de menú en desktop */}
        <div className="hidden md:flex gap-4 items-center">
          <ul className="flex space-x-4 items-center gap-5 poppins-regular text-sm">
            <li>Home</li>
            <li>Projects</li>
            <li>Skills</li>
            <li>Contact</li>
          </ul>

          {/* Botón de contacto */}
          <button className="rounded-full poppins-bold bg-violet-900 px-4 py-2 font-bold hover:bg-fuchsia-700 hover:duration-300 text-sm md:text-base">
            Contact me
          </button>
        </div>
      </nav>
      <div
        className={`${isMenuOpen ? " md:hidden left-0 border-fuchsia-900  border-t-0   border-2  bg-gradient-to-r from-zinc-900 to-violet-900 w-full text-white transition-all duration-500" : "transition-all duration-500"}`}
        style={{
          maxHeight: isMenuOpen ? "1000px" : "0px",
          overflow: "hidden",
        }}
      >
        {isMenuOpen && (
        <div className="md:hidden grid grid-cols-2 text-center h-32 ">
        <div className="hover:bg-fuchsia-700 h-full w-full flex justify-center items-center">Home</div>
        <div className="hover:bg-fuchsia-700 h-full w-full flex justify-center items-center">Projects</div>
        <div className="hover:bg-fuchsia-700 h-full w-full flex justify-center items-center">Skills</div>
        <div className="hover:bg-fuchsia-700 h-full w-full flex justify-center items-center">Contact</div>
      </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
