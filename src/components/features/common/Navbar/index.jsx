import React from "react";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import Link from "next/link";
const Navbar = () => {
  const menuItems = [
    { label: "Skills", icon: "faHome", href: "/skills", download: false  },
    { label: "About", icon: "faUser", href: "/about", download: false  },
    { label: "Projects", icon: "faUser", href: "/projects", download: false  },
    { label: "Resume", icon: "faFile", href: "/RANDY_GRULLON_BAEZ_RESUME.pdf", download: true }, 
    { label: "Let's Talk", icon: "faEnvelope", href: "/contactMe", download: false  },
  ];

  return (
    <nav className="mx-auto md:p-2  py-2 text-white flex flex-row md:flex-row  justify-between items-center overflow-hidden">
      <Link href="/" className="poppins-bold-italic text-2xl">
        RG
      </Link>

      <NavbarMobile menuItems={menuItems} />

      <NavbarDesktop />
    </nav>
  );
};

export default Navbar;
