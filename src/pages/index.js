import Navbar from '@/components/Navbar';
import AboutMe from '@/components/AboutMe';
import Projects from '@/components/Projects';
import Technologies from '@/components/Technologies';
import Layout from './Layout';

const Home = () => {
  return (
    <Layout>
      <div className="mx-auto">
        <AboutMe />
      </div>
      <div className="mx-auto">
        <Technologies />
      </div>
      <div className="mx-auto">
        <Projects />
      </div>
    </Layout>
  );
};

export default Home;
