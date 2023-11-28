import React, { useState } from 'react';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollToTop = () => {
    scroll.scrollToTop();
    closeMenu();
  };

  return (
    <nav className="bg-dark-gray-2 from-warm-300 via-warm-400 to-warm-500 p-4 fixed w-full z-10 flex justify-between items-center">
      <button onClick={scrollToTop} className="text-primary font-bold text-xl cursor-pointer">RG</button>
      {/* Hamburger icon for mobile */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white">
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      {/* Dropdown menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-14 right-0 bg-dark-gray-2 w-full text-center border-t-2">
          <ScrollLink to="about" smooth={true} duration={500} onClick={closeMenu} className="block text-white p-4 hover:text-primary cursor-pointer">About Me</ScrollLink>
          <ScrollLink to="technologies" smooth={true} duration={500} onClick={closeMenu} className="block text-white p-4 hover:text-primary cursor-pointer">Technologies</ScrollLink>
          <ScrollLink to="projects" smooth={true} duration={500} onClick={closeMenu} className="block text-white p-4 hover:text-primary cursor-pointer">Projects</ScrollLink>
          <ScrollLink to="contact" smooth={true} duration={500} onClick={closeMenu} className="block text-white p-4 hover:text-primary cursor-pointer">Contact</ScrollLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
