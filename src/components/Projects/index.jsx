import React, { useState } from 'react';

const ProjectCard = ({ title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const truncatedDescription = isHovered ? description : description.substring(0, 100) + '...';

  return (
    <div
      className="p-6 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-700">{truncatedDescription}</p>
    </div>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "PokeX",
      description:
        "Welcome to our interactive Pokédex, a Next.js-powered application styled with Tailwind CSS to provide an exceptional user experience. Explore a diverse range of Pokémon, mark favorites for quick access, build a formidable team of 6, and engage in thrilling team battles. The sleek design and intuitive navigation enhance your journey, making this Pokédex a must-have for trainers seeking both information and excitement. Powered by Next.js for seamless performance and styled with the efficiency of Tailwind CSS, it promises a visually appealing and responsive design. Embark on this Pokémon adventure, where every detail is crafted for an unforgettable trainer experience!",
    },
    {
      title: "ERP System",
      description:
        "Contributed to the development of a comprehensive ERP system, including modules for recruitment, accounting, inventory, and billing. Ensured seamless functionality and user-friendly interfaces to optimize business processes.",
    },
    {
      title: "Corporate Travel Management System",
      description:
        "Key contributor to the creation of a corporate travel management system, streamlining travel processes within enterprises. Designed and implemented features to enhance efficiency and user experience.",
    },
    {
      title: "Ventajon Enhancement",
      description:
        "Played a crucial role in the enhancement and maintenance of Ventajon, an e-commerce platform. Ensured a seamless user experience and navigation through continuous improvements and updates.",
    },
    // Add more projects as needed
  ];
  

  return (
    <section id="projects" className="pt-20 h-screen bg-gradient-to-r from-warm-300 via-warm-400 to-warm-500 text-white animate__animated animate__fadeIn flex flex-col justify-center items-center">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl text-primary font-bold mb-6">Proyectos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
