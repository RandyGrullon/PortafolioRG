import AboutMe from '@/components/AboutMe';
import ContactMe from '@/components/ContactMe';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Projects from '@/components/Projects';
import Technologies from '@/components/Technologies';
import React from 'react';

const Home = () => {
  return (
    <div className='bg-dark-gray'>
      <Navbar />
      <AboutMe />
      <Technologies />
      <Projects />
      <ContactMe />
      <Footer />
    </div>
  );
};


export default Home;
