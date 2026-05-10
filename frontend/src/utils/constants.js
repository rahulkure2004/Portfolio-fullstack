export const SITE = {
  name: 'Rahul Kure',
  roles: [
    'Full Stack Developer',
    'Java Developer',
    'Spring Boot Developer',
    'React Developer',
    'AI/ML Enthusiast',
    'Freelancer',
    'Software Engineer',
  ],
  tagline:
    'I build premium full stack applications, AI-powered systems, and modern scalable software solutions using React, Java Spring Boot, and MySQL.',
  location: 'Maharashtra, India',
  githubUsername: import.meta.env.VITE_GITHUB_USERNAME || 'rahulkure',
}

export const ABOUT_BIO = {
  paragraphs: [
    'I am a passionate Computer Engineering student and freelance full stack developer with expertise in frontend development, backend engineering, AI/ML systems, REST APIs, and database-driven applications.',
    'I specialize in building scalable web applications, modern UI/UX experiences, AI-powered platforms, and professional software solutions.',
    'I have worked on projects related to multilingual cyberbullying detection, AI waste classification systems, online book shop platforms, government scheme recommendation systems, doctor appointment systems, and intelligent AI applications.',
    'My long-term vision is to establish my own software company and technology training institute.',
  ],
}

export const STATS = [
  { key: 'projects', label: 'Projects Completed', value: 12, suffix: '+' },
  { key: 'tech', label: 'Technologies Learned', value: 35, suffix: '+' },
  { key: 'intern', label: 'Internship Duration', value: 4, suffix: ' mo' },
  { key: 'hours', label: 'Coding Hours', value: 2800, suffix: '+' },
  { key: 'gh', label: 'GitHub Contributions', value: 800, suffix: '+' },
]

export const SKILL_GROUPS = [
  {
    title: 'Frontend',
    items: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Tailwind CSS', 'Bootstrap', 'Framer Motion', 'GSAP', 'Three.js'],
  },
  {
    title: 'Backend',
    items: ['Java', 'Spring Boot', 'REST APIs', 'Spring Security', 'JWT Authentication'],
  },
  {
    title: 'Database',
    items: ['MySQL', 'PostgreSQL', 'MongoDB'],
  },
  {
    title: 'AI / ML',
    items: ['Python', 'TensorFlow', 'NLP', 'Deep Learning', 'Machine Learning'],
  },
  {
    title: 'Other',
    items: ['Git & GitHub', 'Firebase', 'Linux', 'Problem Solving', 'Data Structures'],
  },
]

export const PROJECTS_SEED = [
  {
    slug: 'cyberbullying-detection',
    title: 'Multilingual Cyberbullying Detection',
    short: 'AI-powered cyberbullying detection for Hindi, English, and Hinglish using NLP and Deep Learning.',
    tech: ['Python', 'TensorFlow', 'NLP', 'Flask'],
    features: ['Toxic comment detection', 'Emotion analysis', 'Multilingual support', 'Real-time predictions'],
    githubUrl: '#',
    liveUrl: '#',
    accent: 'from-cyan-500 to-blue-600',
  },
  {
    slug: 'waste-segregation',
    title: 'AI Waste Segregation Education Portal',
    short: 'AI-powered waste classification portal using CNN image classification.',
    tech: ['React', 'TensorFlow', 'Python', 'Flask'],
    features: ['Dry/wet waste detection', 'Educational awareness', 'AI image classification'],
    githubUrl: '#',
    liveUrl: '#',
    accent: 'from-emerald-500 to-cyan-600',
  },
  {
    slug: 'book-shop',
    title: 'Online Book Shop Management System',
    short: 'Full stack e-commerce web application.',
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    features: ['User authentication', 'Cart system', 'Admin dashboard', 'Order management'],
    githubUrl: '#',
    liveUrl: '#',
    accent: 'from-violet-500 to-fuchsia-600',
  },
  {
    slug: 'doctor-appointment',
    title: 'Doctor Appointment Booking System',
    short: 'MERN stack healthcare booking platform.',
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    features: ['Appointment booking', 'Doctor management', 'Authentication system'],
    githubUrl: '#',
    liveUrl: '#',
    accent: 'from-sky-500 to-indigo-600',
  },
  {
    slug: 'scheme-recommender',
    title: 'Government Scheme Recommender',
    short: 'AI-assisted government scheme recommendation platform.',
    tech: ['Java', 'Spring Boot', 'Angular', 'PostgreSQL'],
    features: ['Smart recommendations', 'Eligibility matching', 'User dashboard'],
    githubUrl: '#',
    liveUrl: '#',
    accent: 'from-amber-500 to-orange-600',
  },
]

export const TIMELINE_INTERN = [
  {
    company: 'HEAL BHARAT & Co',
    role: 'Web Development Intern',
    period: 'March 2025 – April 2025',
    description:
      'Worked on responsive web applications, frontend design, backend integration, and modern development workflows.',
  },
  {
    company: 'Prodigy InfoTech',
    role: 'Software Development Intern',
    period: '2025',
    description:
      'Worked on AI chatbot systems, stock trading simulation platforms, and intelligent software applications.',
  },
]

export const EDUCATION = [
  {
    degree: 'Computer Engineering',
    school: 'Savitribai Phule Pune University',
    detail: 'Final year engineering journey — building real-world software, systems design, and AI applications.',
  },
]

export const CERTS = [
  'Internship certificates — HEAL BHARAT & Co, Prodigy InfoTech',
  'Technical certifications — Full stack & web development',
  'Web development learning — modern JavaScript & React ecosystems',
  'AI / ML learning — NLP, deep learning, and intelligent systems',
]

export const TESTIMONIALS_SEED = [
  {
    quote: 'Rahul delivered a professional and modern website with excellent functionality.',
    author: 'Client',
    role: 'Startup founder',
  },
  {
    quote: 'Great communication and high-quality development work.',
    author: 'Client',
    role: 'Product lead',
  },
  {
    quote: 'Highly recommended for full stack and AI-based projects.',
    author: 'Client',
    role: 'Tech recruiter',
  },
]
