import React from "react";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import Image from "next/image";
import bitmoji from "../../../public/images/bitmoji.png";
const Navbar = () => {
 

  const menuItems = [
    { label: "Work", icon: "faHome", href: "#home" },
    { label: "About", icon: "faUser", href: "#about" },
    { label: "Resume", icon: "faFile", href: "#resume" },
    { label: "Let's Talk", icon: "faEnvelope", href: "#contact" },
  ];

  return (
    <nav className="mx-auto md:p-2  py-2 text-white flex flex-row md:flex-row  justify-between items-center overflow-hidden">
       <Image src={bitmoji} alt="Randy Grullon" width={30} height={30} />

      <NavbarMobile menuItems={menuItems} />

      <NavbarDesktop />
    </nav>
  );
};

export default Navbar;
