import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const AboutMe = () => {
  return (
    <section
      id="about"
      className="p-5 w-full md:p-10 flex justify-center items-center  text-white "
    >
      <div className="container mx-auto">
        <div className="text-[40px] lg:text-[100px] md:text-[80px] poppins-bold">
          <h1>RANDY GRULLON</h1>
        </div>
        <div className="flex justify-center  text-center">
          <p className="w-3/5 text-xl">
            👋🏼Hello, I&apos;m Randy - a Software Engineer and Web developer from
            Dominican Republic, who loves, make user-friedly websites
          </p>
        </div>
        <div className="flex justify-center ">
          <button className="">
            <FontAwesomeIcon
              icon={faArrowDown}
              className="text-5xl animate-bounce mt-10  border-2 rounded-full px-5 py-3 border-white
            hover:bg-white hover:text-black  transition-all duration-500 ease-in-out
              "
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
