import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const NavbarDesktop = ({ menuItems, undelineHover }) => {
  return (
    <div className="hidden md:flex gap-4 items-center">
      <ul className="flex space-x-4 items-center gap-5 poppins-regular text-sm">
        {menuItems.map((item, index) => (
          <li key={index} className={undelineHover}>
            {item.label}
          </li>
        ))}
      </ul>
        <button className="poppins-bold px-4 py-2 font-bold hover:bg-blue-500 hover:duration-300 text-sm md:text-base">
          Contact me
        </button>

      <div className="flex items-center gap-2">
        <button className="poppins-bold px-2 py-2 font-bold hover:bg-blue-500 hover:duration-300 text-sm md:text-base">
        CV
          <Link href="https://www.linkedin.com/in/randy-grullon-5b3a3a1b2/">
            <FontAwesomeIcon
              icon={faDownload}
              className="text-2xl text-blue-600 pl-2 hover:text-blue-800 cursor-pointer"
            />
          </Link>
          
        </button>
      </div>
    </div>
  );
};

export default NavbarDesktop;
