"use client";
import { HeroParallax } from "@/components/ui/hero-parallax";
import React from "react";

export function Projects() {
  return <HeroParallax products={products} />;
}
export const products = [
  {
    title: "Hej Seleccion (enterprise private)",
    link: "#",
    thumbnail: "/images/hej-seleccion.jpeg",
  },
  {
    title: "ERP (enterprise private)",
    link: "#",
    thumbnail: "/images/erp.jpeg",
  },

  {
    title: "Activity App",
    link: "https://confirm-assist.vercel.app/",
    thumbnail: "/images/activityApp.jpeg",
  },
  {
    title: "PokeX",
    link: "https://poke-x.vercel.app/",
    thumbnail: "/images/Pokex.jpeg",
  },
];
