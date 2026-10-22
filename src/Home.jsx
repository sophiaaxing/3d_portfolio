import Interlude from './components/Interlude';
import { About, Contact, Experience, Hero, Navbar } from './components';

const Home = () => (
  <div className="relative z-0 bg-primary">
    <div className="hero-atmosphere">
      <Navbar />
      <Hero />
    </div>
    <About />
    <Experience />
    <Interlude />
    <div className="relative z-0">
      <Contact />
    </div>
  </div>
);

export default Home;
