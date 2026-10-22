import { motion, useReducedMotion } from 'framer-motion';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { styles } from '../styles';
import { experiences } from '../constants';
import { SectionWrapper } from '../hoc';
import { textVariant } from '../utils/motion';

const Experience = () => {
  const reducedMotion = useReducedMotion();
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Experience</p>
        <h2 className={styles.sectionHeadText}>Behind the work.</h2>
      </motion.div>
      <p className="mt-5 max-w-2xl text-secondary text-[17px] leading-[30px]">
        From payment APIs to GPU workloads, a look at the systems I’ve helped build and the problems they address.
      </p>
      <div className="experience-timeline mt-14">
        <VerticalTimeline animate={!reducedMotion} lineColor="rgba(163, 68, 100, 0.35)">
          {experiences.map((experience) => (
            <VerticalTimelineElement
              key={experience.company_name}
              date={experience.date}
              contentStyle={{ background: '#fffdfb', color: '#49313e', boxShadow: 'none', border: '1px solid rgba(163,68,100,0.18)', borderRadius: '16px' }}
              contentArrowStyle={{ borderRight: '7px solid #fffdfb' }}
              iconStyle={{ background: experience.iconBg, boxShadow: '0 0 0 4px #edd3dc' }}
              icon={<div className="flex h-full w-full items-center justify-center"><img src={experience.icon} alt="" className="h-[60%] w-[60%] object-contain" /></div>}
            >
              <p className="!mt-0 !text-sm !font-semibold text-[#a34464]">{experience.company_name}</p>
              <h3 className="mt-3 text-2xl font-bold text-ink">{experience.headline}</h3>
              <p className="!mt-2 !text-sm text-secondary">{experience.title}</p>
              <p className="text-secondary !text-base !leading-7">{experience.summary}</p>
              <details className="mt-5">
                <summary className="w-fit cursor-pointer rounded text-sm font-semibold text-[#a34464] hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a34464]">
                  Inside the work <span className="sr-only">at {experience.company_name}</span>
                </summary>
                <div className="mt-5 border-l-2 border-[#a34464]/50 pl-4">
                  <p className="!text-sm font-semibold text-ink">My contribution</p>
                  <ul className="mt-3 list-disc space-y-3 pl-4 text-base leading-7 text-secondary">
                    {experience.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </div>
              </details>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, 'work');
