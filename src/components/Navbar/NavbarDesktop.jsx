import Link from "next/link";

const NavbarDesktop = () => {
  return (
    <div className="hidden md:flex gap-4 items-center">
      <div className="flex space-x-4 items-center gap-3 poppins-bold text-lg ">
        <Link href="#" className="nav-link">
          Work
        </Link>
        <Link href="#" className="nav-link">
          About
        </Link>
        <Link href="#" className="nav-link">
          Resume
        </Link>
        <Link
          href="#"
          className="border-2 px-6 py-2 rounded-full hover:bg-white hover:text-black hover:transition-all hover:duration-300"
        >
          Contact
        </Link>
      </div>
    </div>
  );
};

export default NavbarDesktop;
