import React from "react";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

const Navbar = () => {
  const undelineHover =
    "hover:underline cursor-pointer transition duration-300";

  const menuItems = [
    { label: "Home" },
    { label: "Projects" },
    { label: "Skills" },
    { label: "Contact" },
  ];

  return (
    <nav className="md:p-2 rounded-full md:rounded-full py-2 text-white flex flex-row md:flex-row justify-between items-center">
      <h1 className="text-xl md:text-xl dancing-script-regular">
        Randy Grullon
      </h1>

      <NavbarMobile menuItems={menuItems} />

      <NavbarDesktop menuItems={menuItems} undelineHover={undelineHover} />
    </nav>
  );
};

export default Navbar;
