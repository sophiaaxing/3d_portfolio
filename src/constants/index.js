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
    episodesix,
    aws,
    nvidia,
    google,
    ruif,
    d2k,
    csa,
    csters,
    csclub,
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
      title: "Backend Engineer",
      icon: web,
    },
    {
      title: "Full-Stack Developer",
      icon: backend,
    },
    {
      title: "Systems Programmer",
      icon: mobile,
    },
    {
      title: "AI & Data Engineer",
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
      company_name: "Google",
      headline: "Where finance meets the frontier.",
      summary: "Diving deep into the intersection of finance and software engineering through AI, the frontier of both.",
      icon: google,
      iconBg: "#ffffff",
      date: "August 2026 - Present",
      points: [
        "Building AI-powered tools that help teams retrieve and analyze internal financial data.",
        "Learning what it takes to bring AI into finance, where accuracy and trust matter as much as speed."
      ],
    },
    {
      title: "Cloud Distributed Systems Engineer Intern",
      company_name: "NVIDIA",
      headline: "Real ownership, real impact.",
      summary: "Owned three projects that helped grow revenue and laid the foundation for new ways to use GeForce NOW.",
      icon: nvidia,
      iconBg: "#383E56",
      date: "May 2026 - August 2026",
      points: [
        "Owned three projects end to end across backend storage, scheduling, and platform integrations for GPU-powered cloud workloads.",
        "Shipped work that helped increase revenue for NVIDIA’s cloud gaming ecosystem.",
        "Set up the foundation for GeForce NOW to be used in ways beyond what it supports today.",
      ],
    },
    {
      title: "Software Development Engineer Intern",
      company_name: "Amazon Web Services",
      headline: "Starting from what customers asked for.",
      summary: "Turned customer pain points into frontend and backend features that made the Elastic Load Balancer Console easier to use.",
      icon: aws,
      iconBg: "#ffffff",
      date: "May 2025 - August 2025",
      points: [
        "Dug into the pain points customers raised and looked for where managing load balancers felt harder than it should.",
        "Built Infrastructure-as-Code features across the frontend and backend of the console, giving users better visibility into their resources.",
        "Developed integrations across AWS services so moving between them felt smoother.",
      ],
    },
    {
      title: "Software Engineer Intern",
      company_name: "Episode Six",
      headline: "My first internship, and my first taste of fintech.",
      summary: "Learned frontend and backend development for payments, with a focus on the authentication and security that finance engineering depends on.",
      icon: episodesix,
      iconBg: "#383E56",
      date: "June 2024 - August 2024",
      points: [
        "Worked across the frontend and backend of payment workflows, including Java APIs for transaction processing.",
        "Added authentication and built validation and security features, which matter a lot when the data is people’s money.",
        "Found out how much I enjoy the intersection of finance and tech."
      ]
    // {
    //   title: "Senior Analyst",
    //   company_name: "Rice Undergraduate Investment Fund",
    //   icon: ruif,
    //   iconBg: "#ffffff",
    //   date: "May 2024 - Present",
    //   points: [
    //     "Delivered 5% return on a $40,000 energy portfolio by identifying undervalued equities and leading investment decisions.",
    //     "Developed and defended trade theses by integrating macro factors and performing risk-reward scenario analysis.",
    //   ],
    // },
    // {
    //   title: "Datathon Director",
    //   company_name: "Rice Data To Knowledge Lab",
    //   icon: d2k,
    //   iconBg: "#ffffff",
    //   date: "March 2024 - March 2025",
    //   points: [
    //     "Directing the 7th Annual Rice University Datathon, a city-wide data science competition welcoming 500+ students in previous years.",
    //     "Designing competition tracks, hosting workshops, coordinating schedules, budgeting, and securing sponsorships up to $30,000 in previous years.",
    //   ],
    // },
    // {
    //   title: "External Vice President",
    //   company_name: "Rice Chinese Student Association",
    //   icon: csa,
    //   iconBg: "#a60004",
    //   date: "March 2024 - Present",
    //   points: [
    //     "Lead the coordination of off-campus events, including restaurant outings, collaborations with external organizations, and community service initiatives.",
    //     "Manage alumni relations and head the logistics for the Lunar New Year celebration, securing staging and sponsors to ensure successful and enriching cultural events.",
    //   ],
    // },
    // {
    //   title: "External Vice President",
    //   company_name: "Rice Computer Science Club",
    //   icon: csclub,
    //   iconBg: "#ffffff",
    //   date: "September 2023 - Present",
    //   points: [
    //     "Facilitating a direct, accessible, and constructive conduit for Rice students to voice their opinions and ideas about Rice Computer Science while connecting the Computer Science Department to new students.",
    //     "Coordinating events with 50+ students that provide a forum for freshmen to inquire about the courses with Professors and Teacher’s Assistants in both formal and informal settings.",
    //   ],
    // },
    // {
    //   title: "Social Coordinator",
    //   company_name: "Rice Women in Computing (CSters)",
    //   icon: csters,
    //   iconBg: "#ffffff",
    //   date: "August 2023 - Present",
    //   points: [
    //     "Organizing professional and social events to empower women interested in Computer Science to join a tight-knit “sisterhood” of 150+ current students, alumni, professors, and mentors.",
    //     "Creating opportunities to connect with companies, information sessions on how to better prepare for job interviews, or informal meetings between upperclassmen and underclassmen to share experiences and ask questions.",
    //   ],
    },
  ];
  
  export { services, technologies, experiences };
