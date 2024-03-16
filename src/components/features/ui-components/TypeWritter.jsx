'use-client';
import { useState, useEffect } from "react";
import { TextEffect } from "@/components/features/ui-components/TextGeneration";
import { TypewriterEffectSmooth } from "../../ui/typewriter-effect";
import { CardGradient } from "@/components/features/ui-components/BackgroundCardGradient";
const TypeWritter = () => {
  const words = [
    {
      text: "Ohh!,",
    },
    {
      text: "about",
    },
    {
      text: "me?",
    },
    {
      text: "I'm",
    },
    {
      text: "Randy Grullon.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  const text =
    "Hey, I'm Randy Grullón, a web developer with 3+ years of experience. I'm all about creating awesome user experiences and scalable solutions. From leading teams at IKEA to cool projects like ERP, Job listing system, Ecommerce and more.";

  // Estado para controlar la visibilidad del componente TextEffect
  const [showTextEffect, setShowTextEffect] = useState(false);

  useEffect(() => {
    // Mostrar el TextEffect después de 2.5 segundos
    const timeout = setTimeout(() => {
      setShowTextEffect(true);
    }, 2500);

    // Limpiar el temporizador cuando el componente se desmonte o actualice
    return () => clearTimeout(timeout);
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <div className="flex justify-center text-center ">
      <div className="flex flex-col w-full justify-center  container text-center">
        <h3 className="font-bold text-3xl text-center text-white mb-4">
          <TypewriterEffectSmooth words={words} />
        </h3>
        {showTextEffect && ( // Mostrar TextEffect solo cuando showTextEffect es verdadero
          <div className="text-gray-400 dark:text-neutral-200 text-xs sm:text-base w-full ">
            <div className="w-full flex justify-center">
              <CardGradient />
            </div>
            <div className="mx-7">
              <TextEffect text={text} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TypeWritter;
