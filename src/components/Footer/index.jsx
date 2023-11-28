// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-warm-300 via-warm-400 to-warm-500 py-8 text-white">
      <div className="container mx-auto text-center">
        <p className="text-gray-700 mb-4">Conéctate conmigo en redes sociales:</p>
        <div className="flex space-x-4 justify-center">
          <a href="https://www.instagram.com/randygrullon24/" className="text-secondary flex items-center" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram mr-2"></i> Instagram
          </a>
          <a href="https://github.com/RandyGrullon" className="text-gray-700 flex items-center" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github mr-2"></i> GitHub
          </a>
          <a href="/Resume_Randy_Grullon.pdf" download className="text-gray-700 flex items-center">
            <i className="far fa-file-alt mr-2"></i> Descargar CV
          </a>
        </div>
        <p className="mt-4 text-gray-500">© 2023 Randy Grullon. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
