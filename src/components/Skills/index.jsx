// components/Technologies.js
import React from "react";
import Image from "next/image";
import ArrowLeft from "/public/images/ArrowLeft.svg";
const Technologies = () => {
  const techData = [
    { name: "Next.js", icon: "fab fa-react", color: "primary" },
    { name: "JavaScript", icon: "fab fa-js", color: "yellow" },
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
      id="mySkills"
      style={{ minHeight: "100vh", scrollBehavior: "smooth" }}
      className="pt-80 md:pt-10  text-white flex flex-col justify-center"
    >
      <div className="container mx-auto text-center flex flex-col">
        <div className="flex justify-between mx-10 items-center">
          <div className="items-center">
            <h2 className="text-4xl md:text-[100px] font-bold mb-6 text-white">
              My skills
            </h2>
          </div>
          <div className="items-center">
            <Image
              src={ArrowLeft}
              alt="long left arrow"
              width={500}
              height={0}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-6">
          {techData.map((tech, index) => (
            <div
              key={index}
              className={`text-white p-2 rounded-md flex flex-col items-center cursor-pointer  ease-in transform hover:scale-105 hover:text-primary  duration-100`}
            >
              <i
                className={
                  tech.icon +
                  ` text-5xl mb-2 duration-300 hover:text-${tech.color}`
                }
              ></i>
              <span className={`duration-300`}>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technologies;
