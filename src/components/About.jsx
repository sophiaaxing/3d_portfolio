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
        Hello! My name is Sophia Xing. I am a student at Rice University, studying Computer Science, Mathematics and Business.
        I began university without much certainty on what I truly wanted to pursue as a career, but have found a love for the field
        of computer science. I find the way it intersects with all other fields inspiring and the best way to make a difference. 
      </motion.p>
      <motion.p variants={fadeIn("", "", 0.3, 1)} className="mt-4 text-secondary text-[17px] max-w-5xl leading-[30px]">
        I like to challenge myself. My other interests all stem from this notion. I play tennis because it is a constant battle against
        both myself and my opponent. I make music because not only do I love singing and playing instruments, 
        this is one of the most competitive industries and I challenge myself to try and succeed in spite of that. 
        Additionally, I challenge myself gastronomically by creating my own recipes and attempting to cook dishes I have never even heard of before. 
        Always striving to push past boundaries has made me who I am today and who I will continue to be.
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