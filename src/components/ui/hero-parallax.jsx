"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export const HeroParallax = ({ products }) => {
  const firstPair = products.slice(0, 2);
  const secondPair = products.slice(2, 4);
  const thirdPair = products.slice(4, 6);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-100, 200]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );

  return (
    <div ref={ref} className="h-[230vh] md:h-[150vh]  overflow-hidden antialiased relative">
      <Header />
      <motion.div
        style={{
          translateY,
          opacity,
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 justify-center items-center"
      >
        {firstPair.map((product) => (
          <ProductCard product={product} key={product.title} />
        ))}
        {secondPair.map((product) => (
          <ProductCard product={product} key={product.title} />
        ))}
        {thirdPair.map((product) => (
          <ProductCard product={product} key={product.title} />
        ))}
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto md:py-10 px-4 w-full  left-0 top-0">
      <h1 className="text-4xl md:text-7xl mt-10 text-center font-bold text-white">
        My Projects
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-neutral-200">
        I have worked on a variety of projects, from web development to mobile
        applications. Here are some of my most recent projects.
      </p>
    </div>
  );
};

export const ProductCard = ({ product, translate }) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <Link
        href={product.link}
        className="block group-hover/product:shadow-2xl "
      >
        <Image
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
