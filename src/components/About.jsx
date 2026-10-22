import { motion } from 'framer-motion';
import { styles } from '../styles';
import { textVariant } from '../utils/motion';
import { SectionWrapper } from '../hoc';


const personalNotes = [
  {
    label: '01 / Why I code',
    title: 'Small projects, just for me.',
    body: 'Some of my favorite code never ships anywhere. Small projects I build just for myself are where I get to be creative, try ideas with no pressure, and remember why I fell in love with coding in the first place.',
  },
  {
    label: '02 / Where finance meets tech',
    title: 'Systems behind the markets.',
    body: 'Quantitative finance, investing, and entrepreneurship pull me toward the space where technology meets business. Alongside CS and mathematics, I’m pursuing a Business minor and am involved in Rice’s undergraduate investment fund.',
  },
  {
    label: '03 / Off the clock',
    title: 'Stories and poems.',
    body: 'I write short stories and poems. It’s a different kind of making than code, but it scratches the same itch as my side projects: creating something just because I want it to exist.',
  },
];

const About = () => (
  <>
    <div>
    <div>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>About me</p>
      <h2 className={styles.sectionHeadText}>What I’m into.</h2>
    </motion.div>
    <p className="mt-5 max-w-3xl text-secondary text-[17px] leading-[30px]">
      As an engineer, I’m drawn to what happens behind the scenes: the infrastructure, distributed systems, and AI that make useful software possible.
    </p>
    </div>
    </div>
    <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
      {personalNotes.map((note) => (
        <article key={note.label} className="personal-note rounded-xl border border-accent/15 bg-white p-6">
          <p className="text-sm text-secondary tracking-wide">{note.label}</p>
          <h3 className="mt-4 text-2xl font-bold text-ink">{note.title}</h3>
          <p className="mt-4 text-base leading-7 text-secondary">{note.body}</p>
        </article>
      ))}
    </div>
  </>
);

export default SectionWrapper(About, 'about');
