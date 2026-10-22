export const site = {
  name: 'Sophia Xing',
  roles: ['engineer', 'builder', 'student'],
  resume: '/files/sophia-xing-resume.pdf',
  email: 'sx25@rice.edu',
  links: {
    linkedin: 'https://www.linkedin.com/in/sophiaxing123/',
    github: '',
  },
};

export interface NavItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  hideOnMobile?: boolean;
}

export const nav: NavItem[] = [
  { id: 'index', label: 'index', href: '/', hideOnMobile: true },
  { id: 'work', label: 'work', href: '/city/work' },
  { id: 'projects', label: 'projects', href: '/city/projects' },
  { id: 'about', label: 'about', href: '/city/about' },
  { id: 'resume', label: 'resume', href: site.resume, external: true },
];
