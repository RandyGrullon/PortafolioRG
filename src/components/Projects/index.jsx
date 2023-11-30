import React from "react";

const ProjectCard = ({ title, description, link }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <div className="p-6 rounded-md shadow-md">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </a>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "Hej Selección (IKEA)",
      description:
        "Contributed to the development of the Hej Selección application for IKEA, where users can view job vacancies, register or log in, and apply for positions. Implemented features to track the application status for users.",
      link: "/", // Replace with your actual link
    },
    {
      title: "ERP System (IKEA)",
      description:
        "Contributed to the development of a comprehensive ERP system, including modules for recruitment, accounting, inventory, and billing. Ensured seamless functionality and user-friendly interfaces to optimize business processes.",
      link: "/", // Replace with your actual link
    },
    {
      title: "PokeX",
      description:
        "Welcome to our interactive Pokédex! A Next.js-powered app styled with Tailwind CSS for a seamless user experience. Explore Pokémon, mark favorites, build teams, and engage in team battles. Powered by Next.js and styled with Tailwind CSS, it promises a visually appealing and responsive design.",
      link: "https://poke-x.vercel.app", // Replace with your actual link
    },
    {
      title: "TuViaje Corporate Travel Management System",
      description:
        "Key contributor to the creation of a corporate travel management system, streamlining travel processes within enterprises. Designed and implemented features to enhance efficiency and user experience.",
      link: "/", // Replace with your actual link
    },
    {
      title: "Ventajon",
      description:
        "Played a crucial role in the enhancement and maintenance of Ventajon, an e-commerce platform. Ensured a seamless user experience and navigation through continuous improvements and updates.",
      link: "https://ventajon.com", // Replace with your actual link
    },
    // Add more projects as needed
  ];

  return (
    <section
      id="projects"
      className="pt-20  lg:h-screen md:h-screen  bg-gradient-to-r from-warm-300 via-warm-400 to-warm-500 text-white animate__animated animate__fadeIn flex flex-col justify-center items-center"
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-primary">Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
