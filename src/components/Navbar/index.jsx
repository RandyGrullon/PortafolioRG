// components/Navbar.js
import React from 'react';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';

const Navbar = () => {
  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  return (
    <nav className="bg-dark-gray-2 from-warm-300 via-warm-400 to-warm-500 p-4 fixed w-full z-10 flex justify-between items-center">
      <button onClick={scrollToTop} className="text-primary font-bold text-xl cursor-pointer">RG</button>
      <div className="flex space-x-4">
        <ScrollLink to="about" smooth={true} duration={500} className="text-white cursor-pointer hover:text-primary">Acerca de mí</ScrollLink>
        <ScrollLink to="technologies" smooth={true} duration={500} className="text-white cursor-pointer hover:text-primary">Tecnologías</ScrollLink>
        <ScrollLink to="projects" smooth={true} duration={500} className="text-white cursor-pointer hover:text-primary">Proyectos</ScrollLink>
        <ScrollLink to="contact" smooth={true} duration={500} className="text-white cursor-pointer hover:text-primary">Contacto</ScrollLink>
      </div>
    </nav>
  );
};

export default Navbar;
