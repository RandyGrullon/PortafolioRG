// components/Technologies.js
import React from "react";

const Technologies = () => {
  const techData = [
    { name: "Next.js", icon: "fab fa-react", color: "primary" },
    { name: "JavaScript", icon: "fab fa-js", color: "amarillo" },
    { name: "ReactJS", icon: "fab fa-react", color: "secondary" },
    { name: "Tailwind CSS", icon: "fa-solid fa-wind", color: "primary" },
    { name: "Git", icon: "fab fa-git-alt", color: "red" },
    { name: "GitHub", icon: "fab fa-github", color: "dark-gray" },
    { name: "Sass", icon: "fab fa-sass", color: "pink" },
    { name: "Bootstrap", icon: "fab fa-bootstrap", color: "purple" },
    { name: "Redux", icon: "fab fa-react", color: "secondary" },
    { name: "Node.js", icon: "fab fa-node-js", color: "green" },
    { name: "Express.js", icon: "fas fa-server", color: "dark-gray" },
    { name: "MongoDB", icon: "fas fa-database", color: "green" },
    { name: "GitLab", icon: "fab fa-gitlab", color: "orange" },
    { name: "AWS", icon: "fas fa-cloud", color: "purple" },
    { name: "Figma", icon: "fab fa-figma", color: "purple" },
  ];

  return (
    <section
      id="technologies"
      className="pt-20 h-screen p-10 bg-gradient-to-r from-warm-300 via-warm-400 to-warm-500 text-white flex flex-col justify-center"
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-primary">Tecnologías</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Aquí están algunas de las tecnologías con las que trabajo:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-6">
          {techData.map((tech, index) => (
            <div
              key={index}
              className={`text-white p-2 rounded-md flex flex-col items-center cursor-pointer duration-300 ease-in-out transform hover:scale-105 `}
            >
              <i
                className={
                  tech.icon +
                  ` text-5xl mb-2 duration-300 hover:text-${tech.color}`
                }
              ></i>
              <span className={`mt-2  duration-300`}>
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technologies;
