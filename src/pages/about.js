import React from "react";
import Layout from "./Layout";
import Footer from "@/components/features/common/Footer";
import TypeWritter from "../components/features/ui-components/TypeWritter";

const about = () => {
  return (
    <Layout className="h-screen overflow-hidden">
      <div>
        <TypeWritter />
        <Footer />
      </div>
    </Layout>
  );
};

export default about;
