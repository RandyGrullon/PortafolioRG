// components/Technologies.js
import React from "react";
import Image from "next/image";
import ArrowLeft from "/public/images/ArrowLeftDown.svg";
import { CardHoverEffect } from "../../ui-components/HoverEffect";
const Skills = () => {
  const techData = [
    { title: "Next.js", icon: "fab fa-react" },
    { title: "JavaScript", icon: "fab fa-js" },
    { title: "ReactJS", icon: "fab fa-react" },
    { title: "Tailwind CSS", icon: "fa-solid fa-wind" },
    { title: "Git", icon: "fab fa-git-alt" },
    { title: "GitHub", icon: "fab fa-github" },
    { title: "Sass", icon: "fab fa-sass" },
    { title: "Bootstrap", icon: "fab fa-bootstrap" },
    { title: "Redux", icon: "fab fa-react" },
    { title: "Node.js", icon: "fab fa-node-js" },
    { title: "Express.js", icon: "fas fa-server" },
    { title: "MongoDB", icon: "fas fa-database" },
    { title: "GitLab", icon: "fab fa-gitlab" },
    { title: "AWS", icon: "fas fa-cloud" },
    { title: "Figma", icon: "fab fa-figma" },
  ];

  return (
    <section id="mySkills" className=" text-white flex flex-col justify-center">
      <div className="container w-full mx-auto text-center flex flex-col">
        <div className="flex mx-auto items-center">
          <div className="items-center w-full my-10">
            <h2 className="text-4xl md:text-[80px] lg:text-[100px] font-bold text-center  text-white">
              My skills
            </h2>
          </div>
          <div className="items-center h-full w-44 md:w-64">
            <Image
              src={ArrowLeft}
              alt="long left arrow"
              width={300}
              height={300}
            />
          </div>
        </div>
        <div className="">
          <CardHoverEffect projects={techData} />
        </div>
      </div>
    </section>
  );
};

export default Skills;
