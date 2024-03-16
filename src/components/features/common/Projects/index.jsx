import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Projects = () => {
  return (
    <section
      id="projects"
      style={{ minHeight: "100vh", scrollBehavior: "smooth" }}
      className="pt-10 text-white flex flex-col justify-center items-center"
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-primary">Projects</h2>
      </div>
    </section>
  );
};

export default Projects;
