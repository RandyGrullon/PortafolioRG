import React, { useState } from 'react';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  return (
    <nav className="bg-dark-gray-2 from-warm-300 via-warm-400 to-warm-500 p-4 fixed w-full z-10 flex justify-between items-center">
      <button onClick={scrollToTop} className="text-primary font-bold text-xl cursor-pointer">RG</button>
      <div className="hidden md:flex space-x-4">
        <ScrollLink to="about" smooth={true} duration={500} className="text-white cursor-pointer hover:text-primary">About Me</ScrollLink>
        <ScrollLink to="technologies" smooth={true} duration={500} className="text-white cursor-pointer hover:text-primary">Technologies</ScrollLink>
        <ScrollLink to="projects" smooth={true} duration={500} className="text-white cursor-pointer hover:text-primary">Projects</ScrollLink>
        <ScrollLink to="contact" smooth={true} duration={500} className="text-white cursor-pointer hover:text-primary">Contact</ScrollLink>
      </div>
      <div className="md:hidden flex items-center">
        <button onClick={toggleNavbar} className="text-white focus:outline-none">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-dark-gray-2 z-20 p-4 flex flex-col items-center space-y-4">
          <ScrollLink to="about" smooth={true} duration={500} className="text-white cursor-pointer hover:text-primary">About Me</ScrollLink>
          <ScrollLink to="technologies" smooth={true} duration={500} className="text-white cursor-pointer hover:text-primary">Technologies</ScrollLink>
          <ScrollLink to="projects" smooth={true} duration={500} className="text-white cursor-pointer hover:text-primary">Projects</ScrollLink>
          <ScrollLink to="contact" smooth={true} duration={500} className="text-white cursor-pointer hover:text-primary">Contact</ScrollLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
