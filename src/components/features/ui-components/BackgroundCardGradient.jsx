"use client";
import React from "react";
import Image from "next/image";
import { BackgroundGradient } from "@/components/ui/background-gradient";

export function CardGradient() {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] w-full p-4 sm:p-10 bg-black">
        <Image
          src={`/images/profilepic2.png`}
          alt="jordans"
          height="200"
          width="200"
          className="object-contain"
        />
      </BackgroundGradient>
    </div>
  );
}
