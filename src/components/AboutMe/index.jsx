import React from "react";

const AboutMe = () => {
  return (
    <section
      id="about"
      className="p-5 md:p-10 flex relative items-center text-white"
    >
      <div className="flex flex-col md:flex-row justify-start  w-full">
        <div className="flex justify-center  md:w-1/2">
          <div className="flex justify-center flex-col gap-6">
            <div>
              <h1 className="capitalize text-2xl poppins-thin">
                Full-stack web developer
              </h1>
            </div>
            <div className="text-[40px] md:text-[150px] leading-[1] poppins-bold">
              <h1>RANDY</h1>
              <h1 className="">GRULLON</h1>
            </div>

            <div className="flex gap-4 items-center">
              <div className="border-l-2 border-white h-20 md:h-28 "></div>
              <div className="poppins-regular">
                <h1>
                  I&apos;m a software engineer
                  <br /> and I work with web
                  <br /> languages
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
