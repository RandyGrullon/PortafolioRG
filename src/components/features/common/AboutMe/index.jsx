import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MovingBorderButton } from "../../ui-components/BorderButtonMoving";
import { TextEffect } from "../../ui-components/TextGeneration";

const AboutMe = () => {
  const words =
  "👋🏼Hello, I'm Randy a Software Engineer and Web Developer from Dominican Republic, who loves make user-friendly websites";

  return (
    <section
      id="about"
      className=" w-full  flex justify-center  h-screen mt-10  text-white"
    >
      <div className="container mx-auto">
        <div className="text-[40px] text-center lg:text-[100px] md:text-[80px] poppins-bold">
          <h1>RANDY GRULLON</h1>
        </div>
        <div className="flex justify-center  text-center text-white">
         <TextEffect text={words}/>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/bitmoji.png"
            alt="Randy Grullon"
            width={300}
            height={300}
            className="rounded-full"
          />
        </div>
       
      </div>
    </section>
  );
};

export default AboutMe;
