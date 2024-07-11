import {
    mobile,
    backend,
    creator,
    web,
    python,
    java,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    meta,
    starbucks,
    tesla,
    shopify,
    episodesix,
    ruif,
    d2k,
    csa,
    csters,
    carrent,
    jobit,
    tripguide,
    threejs,
  } from "../assets";
  
  export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "work",
      title: "Work",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];
  
  const services = [
    {
      title: "UI/UX Developer",
      icon: web,
    },
    {
      title: "Backend Developer",
      icon: backend,
    },
    {
      title: "Database Engineer",
      icon: mobile,
    },
    {
      title: "iOS Developer",
      icon: creator,
    },
  ];
  
  const technologies = [
    {
      name: "python",
      icon: python,
    },
    {
      name: "java",
      icon: java,
    },
    {
      name: "HTML 5",
      icon: html,
    },
    {
      name: "CSS 3",
      icon: css,
    },
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "TypeScript",
      icon: typescript,
    },
    {
      name: "React JS",
      icon: reactjs,
    },
    {
      name: "Redux Toolkit",
      icon: redux,
    },
    {
      name: "Tailwind CSS",
      icon: tailwind,
    },
    {
      name: "Node JS",
      icon: nodejs,
    },
    {
      name: "MongoDB",
      icon: mongodb,
    },
    {
      name: "Three JS",
      icon: threejs,
    },
    {
      name: "git",
      icon: git,
    },
    // {
    //   name: "figma",
    //   icon: figma,
    // },
    // {
    //   name: "docker",
    //   icon: docker,
    // },
  ];
  
  const experiences = [
    {
      title: "Software Engineer Intern",
      company_name: "Episode Six",
      icon: episodesix,
      iconBg: "#383E56",
      date: "June 2024 - Present",
      points: [
        "Implemented feature and bug fix tickets for frontend and backend, using Java, React, Javascript, Typescript, Cassandra and SQL.",
        "Gained hands-on experience working with API calls, database queries, and authentication to protect sensitive data.",
        "Utilized Agile to manage project timelines, collaborating with cross-functional teams including designers, quality assurance, and software delivery engineer testers in code reviews, providing and receiving constructive feedback to ensure code quality and maintainability."
      ],
    },
    {
      title: "Junior Financial Analyst",
      company_name: "Rice Undergraduate Investment Fund",
      icon: ruif,
      iconBg: "#ffffff",
      date: "May 2024 - Present",
      points: [
        "Accepted as junior analyst for a successful stock pitch and technical interview for the RUIF Executive Board.",
        "Gained experience in both the quantitative and qualitative aspects of building an investment thesis, financial accounting and analysis, and portfolio theory.",
      ],
    },
    {
      title: "Datathon Director",
      company_name: "Rice Data To Knowledge Lab",
      icon: d2k,
      iconBg: "#ffffff",
      date: "March 2024 - Present",
      points: [
        "Directing the 7th Annual Rice University Datathon, a city-wide data science competition welcoming 500+ students in previous years.",
        "Designing competition tracks, hosting workshops, coordinating schedules, budgeting, and securing sponsorships up to $30,000 in previous years.",
      ],
    },
    {
      title: "External Vice President",
      company_name: "Rice Chinese Student Association",
      icon: csa,
      iconBg: "#a60004",
      date: "March 2024 - Present",
      points: [
        "Lead the coordination of off-campus events, including restaurant outings, collaborations with external organizations, and community service initiatives.",
        "Manage alumni relations and head the logistics for the Lunar New Year celebration, securing staging and sponsors to ensure successful and enriching cultural events.",
      ],
    },
    {
      title: "Event Chair",
      company_name: "Rice Computer Science Club",
      icon: csters,
      iconBg: "#ffffff",
      date: "September 2023 - Present",
      points: [
        "Facilitating a direct, accessible, and constructive conduit for Rice students to voice their opinions and ideas about Rice Computer Science while connecting the Computer Science Department to new students.",
        "Coordinating events with 50+ students that provide a forum for freshmen to inquire about the courses with Professors and Teacher’s Assistants in both formal and informal settings.",
      ],
    },
    {
      title: "Social Coordinator",
      company_name: "Rice Women in Computing (CSters)",
      icon: csters,
      iconBg: "#ffffff",
      date: "August 2023 - Present",
      points: [
        "Organizing professional and social events to empower women interested in Computer Science to join a tight-knit “sisterhood” of 150+ current students, alumni, professors, and mentors.",
        "Creating opportunities to connect with companies, information sessions on how to better prepare for job interviews, or informal meetings between upperclassmen and underclassmen to share experiences and ask questions.",
      ],
    },
  ];
  
  const testimonials = [
    {
      testimonial:
        "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
      name: "Daniel Ling",
      designation: "Founder",
      company: "XV Resupply, LLC.",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      testimonial:
        "I've never met a web developer who truly cares about their clients' success like Rick does.",
      name: "Chris Brown",
      designation: "COO",
      company: "DEF Corp",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      testimonial:
        "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
      name: "Lisa Wang",
      designation: "CTO",
      company: "456 Enterprises",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
    },
  ];
  
  const projects = [
    {
      name: "Car Rent",
      description:
        "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "mongodb",
          color: "green-text-gradient",
        },
        {
          name: "tailwind",
          color: "pink-text-gradient",
        },
      ],
      image: carrent,
      source_code_link: "https://github.com/",
    },
    {
      name: "Job IT",
      description:
        "Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "restapi",
          color: "green-text-gradient",
        },
        {
          name: "scss",
          color: "pink-text-gradient",
        },
      ],
      image: jobit,
      source_code_link: "https://github.com/",
    },
    {
      name: "Trip Guide",
      description:
        "A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.",
      tags: [
        {
          name: "nextjs",
          color: "blue-text-gradient",
        },
        {
          name: "supabase",
          color: "green-text-gradient",
        },
        {
          name: "css",
          color: "pink-text-gradient",
        },
      ],
      image: tripguide,
      source_code_link: "https://github.com/",
    },
  ];
  
  export { services, technologies, experiences, testimonials, projects };