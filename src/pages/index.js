import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import Navbar from '@/components/Navbar';
import AboutMe from '@/components/AboutMe';
import Projects from '@/components/Projects';
import Technologies from '@/components/Technologies';

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-zinc-900 to-violet-900 h-full relative">
      {/* Líneas flotantes a la izquierda */}
      <div className="fixed left-0 top-0 flex justify-center flex-col h-screen gap-10 opacity-20">
        <div className="border-2 border-fuchsia-500 w-10 rotate-45"></div>
        <div className="border-2 border-fuchsia-500 w-10 rotate-45"></div>
        <div className="border-2 border-fuchsia-500 w-10 rotate-45"></div>
        <div className="border-2 border-fuchsia-500 w-10 rotate-45"></div>
        <div className="border-2 border-fuchsia-500 w-10 rotate-45"></div>
      </div>

      {/* Círculos de redes sociales a la derecha */}
      <div className="fixed right-0 top-0 flex justify-center flex-col h-screen gap-10  pr-2">
        <FontAwesomeIcon icon={faInstagram} className="text-white text-2xl" />
        <FontAwesomeIcon icon={faGithub} className="text-white text-2xl" />
        <FontAwesomeIcon icon={faLinkedin} className="text-white text-2xl" />
      </div>

      {/* Contenido */}
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
