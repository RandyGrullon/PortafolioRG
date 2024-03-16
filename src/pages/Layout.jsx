import Footer from "@/components/features/common/Footer";
import Navbar from "@/components/features/common/Navbar";
import React from "react";

const Layout = ({ children, className }) => {
  return (
    <div className={`flex justify-center bg-black ` + className}>
      <div className="max-w-screen-lg w-full px-4">
        <div className="">
          <Navbar />
          <hr />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
