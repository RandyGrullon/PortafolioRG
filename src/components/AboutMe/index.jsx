import React from "react";
import Image from "next/image";

const AboutMe = () => {
  return (
    <section
      id="about"
      className="pt-20  lg:h-screen flex flex-col justify-center items-center bg-gradient-to-r from-warm-300 via-warm-400 to-warm-500 text-white animate__animated animate__fadeIn"
    >
      <div className="container mx-auto text-center p-4">
      <Image
          src="/profilepic2.jpg"
          alt="Tu Nombre"
          className="mt-8 rounded-full  mx-auto border-4 border-primary"
          style={{
            width: "150px",
            height: "150px",
            objectFit: "cover",
          }}
          width={150}
          height={150}
        />
        <h2 className="text-4xl font-bold mb-6 text-primary">Acerca de mí</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Hello, I&apos;m <a className="text-primary text-xl">Randy Grullon</a>, a software engineer specializing in frontend
          web development. I have hands-on experience with technologies such as
          Next.js, ReactJS, Node.js, Express.js, Redux, Git, TypeScript, and
          MongoDB. I&apos;ve been involved in diverse projects, ranging from crafting
          e-commerce platforms to developing ERP systems, landing pages, and
          other innovative initiatives. My primary focus is on creating
          exceptional user experiences by leveraging these technologies to build
          robust and engaging solutions. I&apos;m excited to continue exploring new
          opportunities and challenges in the dynamic realm of frontend
          development.
        </p>
       
      </div>
    </section>
  );
};

export default AboutMe;
