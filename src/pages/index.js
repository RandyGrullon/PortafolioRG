import AboutMe from '@/components/AboutMe';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Layout from './Layout';

const Home = () => {
  return (
    <Layout>
      <div className="mx-auto">
        <AboutMe />
      </div>
      <div className="mx-auto">
        <Skills />
      </div>
      <div className="mx-auto">
        <Projects />
      </div>
    </Layout>
  );
};

export default Home;
