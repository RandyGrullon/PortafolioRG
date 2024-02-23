import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';


const HamburguerIcon = ({ toggleMenu, isMenuOpen }) => {
  return (
    <div>
      <button
        className="focus:outline-none"
        onClick={toggleMenu}
      >
        <FontAwesomeIcon
          icon={isMenuOpen ? faTimes : faBars} // Usamos el icono faTimes si el menú está abierto, de lo contrario, usamos faBars
          className="w-6 h-6 fill-current transition duration-500" // Agregamos la clase de transición
        />
      </button>
    </div>
  );
};

export default HamburguerIcon;
