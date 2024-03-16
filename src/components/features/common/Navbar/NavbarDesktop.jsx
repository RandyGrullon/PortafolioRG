import Link from "next/link";

const NavbarDesktop = () => {
  return (
    <div className="hidden md:flex gap-4 items-center">
      <div className="flex space-x-4 items-center gap-3 poppins-bold text-lg ">
        <Link href="/about" className="nav-link">
          About
        </Link>
        <Link href="/projects" className="nav-link">
          Projects
        </Link>
        <Link href="/skills" className="nav-link">
          Skills
        </Link>
        <a href="/RANDY_GRULLON_BAEZ_RESUME.pdf" className="nav-link"  download>
          Resume
        </a>
        <Link
          href="/contactMe"
         
          className="border-2 px-6 py-2 rounded-full hover:bg-white hover:text-black hover:transition-all hover:duration-700 hover:ease-in-out transition-all duration-700 ease-in-out text-white border-white hover:border-"
        >
          Contact
        </Link>
      </div>
    </div>
  );
};

export default NavbarDesktop;
