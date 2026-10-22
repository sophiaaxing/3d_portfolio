import { useState } from 'react';
import { styles } from '../styles';

const notes = [
  'Favorite places I’ve been so far: Aruba and Switzerland.',
  'Volleyball, tennis, pickleball, ping pong. Always down to learn a new sport, except soccer. Two left feet.',
  'Newest hobby: photography. Still learning, and loving it.',
];

const Hero = () => {
  const [note, setNote] = useState(0);
  return (
    <section className={`${styles.paddingX} relative max-w-7xl mx-auto pt-32 pb-16 sm:pt-40`}>
      <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] leading-[1.05] text-ink editorial-title">
            Hi, I’m <span className="italic text-accent">Sophia.</span>
          </h1>
          <p className="mt-7 max-w-xl text-secondary text-base sm:text-lg leading-8">
            I study computer science and math at Rice. This is my corner of the internet for the work I’m proud of, the things I write, and whatever I’m into lately.
          </p>
          <p className="mt-4 text-base text-secondary">Right now I’m interning at Google, working on AI tools for finance.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="scrap-button border border-accent/30 text-ink hover:bg-tertiary">My work <span aria-hidden="true">↓</span></a>
            <a href="/files/sophia-xing-resume.pdf" className="scrap-button border border-accent/30 text-ink hover:bg-tertiary">Resume</a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[360px] px-3">
          <figure className="portrait-paper">
            <img src="/images/sophia.JPG" alt="Sophia by a window overlooking the water" width="2048" height="1536" fetchPriority="high" className="aspect-[4/5] w-full object-cover object-[38%_center] rounded-sm" />
            <figcaption className="editorial-title italic text-center text-2xl text-ink pt-5 pb-2">that’s me ♡</figcaption>
          </figure>
          <div className="mt-7 relative rounded-xl border border-[#e0b2ba] bg-[#fce5e8] p-5 text-center shadow-sm">
            <p className="text-xs uppercase tracking-widest text-accent">A note from me · {note + 1} / {notes.length}</p>
            <p aria-live="polite" className="mt-3 min-h-[5.25rem] text-base leading-7 text-ink">{notes[note]}</p>
            <button type="button" onClick={() => setNote((note + 1) % notes.length)} className="mt-3 text-sm text-accent underline underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">Another note ↻</button>
          </div>
        </div>
      </div>
      <a href="#about" className="mt-14 inline-block text-sm text-secondary hover:text-accent">Get to know me <span className="scroll-nudge inline-block" aria-hidden="true">↓</span></a>
    </section>
  );
};

export default Hero;
