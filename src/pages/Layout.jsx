import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="flex justify-center bg-black min-h-screen">
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
