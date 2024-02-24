import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import Navbar from '@/components/Navbar';
import AboutMe from '@/components/AboutMe';
import Projects from '@/components/Projects';
import Technologies from '@/components/Technologies';

const Home = () => {
  return (
    <div className="bg-gray-900 h-full relative md:px-32 ">
      <div className="px-6 py-1">
        <Navbar />
      </div>
      <div>
        <AboutMe />
      </div>
      <div>
        <Projects />
      </div>
      <div>
        <Technologies />
      </div>
    </div>
  );
};

export default Home;
