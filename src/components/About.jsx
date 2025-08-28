import React from "react";
import { Tilt } from "react-tilt";
import { motion } from 'framer-motion';

import { styles } from '../styles';
import { services } from '../constants';
import { fadeIn, textVariant } from '../utils/motion'; 
import { SectionWrapper } from "../hoc";

const ServiceCard = ({ index, title, icon }) => {
  return (
    <Tilt className="xs:w-[250px] w-full">
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450
          }}
          className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col"
        >
          <img
            src={icon}
            alt={title}
            className="w-16 h-16 object-contain "
          />
          <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
        </div>
      </motion.div>
    </Tilt>
  )
}

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview</h2>
      </motion.div>
      
      <motion.p variants={fadeIn("", "", 0.1, 1)} className="mt-4 text-secondary text-[17px] max-w-4xl leading-[30px]">
        I am a student at Rice University studying Computer Science, Mathematics, and Business. 
        When I first started college, I was uncertain about where I wanted to focus, but I quickly found myself drawn to computer science. 
        I enjoy the way it combines creativity with problem-solving and connects across so many different fields. 
        For me, coding is not just about writing programs but about building systems, uncovering patterns, and finding elegant solutions to complex problems.
      </motion.p>
      <motion.p variants={fadeIn("", "", 0.3, 1)} className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]">
        Outside of academics, I look for challenges that push me to grow. 
        Tennis teaches me discipline and strategy under pressure. 
        Music allows me to balance creativity with persistence. 
        Cooking gives me space to experiment and learn by trial and error. 
        In each of these, I enjoy pushing boundaries and seeing what I can create when I take on something unfamiliar.
      </motion.p>
      <motion.p variants={fadeIn("", "", 0.5, 1)} className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]">
        That same mindset shapes how I approach my work. 
        I thrive when I am challenged to think critically, learn quickly, and adapt to new situations. 
        It is why I am drawn to careers in software engineering and quantitative analysis, where curiosity and rigor come together to solve meaningful problems and create lasting impact.
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service}/>
        ))}
      </div>
    </>
  )
}

export default SectionWrapper(About, "about")