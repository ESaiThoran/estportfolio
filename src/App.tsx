import React, { useState, useEffect, useCallback } from 'react';
import { TypeAnimation } from 'react-type-animation';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { 
  Code2, 
  Github, 
  Linkedin, 
  Mail, 
  ChevronUp,
  Award,
  GraduationCap,
  FileText
} from 'lucide-react';
import { SplashCursor } from './components/ui/splash-cursor';
import { SparklesCore } from './components/ui/sparkles';
import { BackgroundGradientAnimation } from './components/ui/background-gradient-animation';
import { LampContainer } from './components/ui/lamp';
import { ContainerScroll } from './components/ui/container-scroll-animation';
import { Timeline } from './components/ui/timeline';
import { MagicTextReveal } from './components/ui/magic-text-reveal';
import { Squares } from './components/ui/squares-background';
import { motion } from 'framer-motion';

function App() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('normal');
  
  // Optimized intersection observers
  const { ref: aboutRef, inView: aboutInView } = useInView({
    threshold: 0.05,
    triggerOnce: true,
    rootMargin: '-20px 0px'
  });
  
  const { ref: skillsRef, inView: skillsInView } = useInView({
    threshold: 0.05,
    triggerOnce: true,
    rootMargin: '-20px 0px'
  });
  
  const { ref: projectsRef, inView: projectsInView } = useInView({
    threshold: 0.02,
    triggerOnce: true,
    rootMargin: '100px 0px'
  });
  
  const { ref: certificationsRef, inView: certificationsInView } = useInView({
    threshold: 0.05,
    triggerOnce: true,
    rootMargin: '-20px 0px'
  });
  
  const { ref: contactRef, inView: contactInView } = useInView({
    threshold: 0.05,
    triggerOnce: true,
    rootMargin: '-20px 0px'
  });

  // Optimized scroll handler
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolling(currentScrollY > 50);
          setShowScrollTop(currentScrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optimized mouse handlers
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 60;
    const rotateY = (centerX - x) / 60;
    
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitStatus('submitting');
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      await fetch(form.action, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });
      
      setSubmitStatus('success');
      
      setTimeout(() => {
        form.reset();
        setSubmitStatus('normal');
        setIsSubmitting(false);
      }, 2000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('success');
      
      setTimeout(() => {
        form.reset();
        setSubmitStatus('normal');
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const getButtonText = () => {
    switch (submitStatus) {
      case 'submitting':
        return 'Transmitting...';
      case 'success':
        return 'Data Transmitted';
      default:
        return 'Initiate Data Transfer';
    }
  };

  // Projects data
  const projects = [
    {
      title: "JARVIS for System",
      year: "2025",
      description: "Enabled it with natural language understanding and responding. Conversational and operational response also performance actions & efficient task execution.",
      tech: ["LLM", "Python", "TensorFlow", "Torch", "pandas", "selenium"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Phishing Detection Tool",
      year: "2025",
      description: "Developed Real time Chrome extension that employs machine learning algorithm Random Forest to detect and mitigate phishing websites. The AI system achieved 93% accuracy.",
      tech: ["Javascript", "CSS & HTML", "Python", "AI & ML"],
      category: "AI Chrome extension",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Cryptography with Steganography Web Tool",
      year: "2024",
      description: "Developed a website that encrypts and conceals data in media files (Image, Video, Audio, txt-file) using advanced cryptographic and steganographic techniques, aim to withstand quantum computers.",
      tech: ["Java Script", "CSS", "Python", "Flask", "pandas", "cryptography", "steganography"],
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Emotion Detection from Voice",
      year: "2024",
      description: "Developed a sophisticated Speech Emotion Recognition (SER) system utilizing LSTM neural network. It accurately interpret intricate emotional states.",
      tech: ["TKinter", "ML", "Python"],
      category: "HCI & ML",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Restaurant Management System",
      year: "2023",
      description: "Developed and implemented a comprehensive website with UI/UX frontend and backend. Implemented with user facilities like creating accounts, finding items, managing cart, saving inventory, self-order at dining, easy navigation and payment.",
      tech: ["JavaScript", "CSS", "HTML", "PHP", "SQL"],
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Transform projects data for timeline
  const timelineData = projects.map((project, index) => ({
    title: project.title,
    content: (
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        viewport={{ once: true, margin: "50px" }}
      >
        {project.category && (
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            viewport={{ once: true, margin: "50px" }}
          >
            <span className="px-3 py-1 bg-purple-500/20 border border-purple-400/50 rounded-full text-sm font-medium text-purple-200">
              {project.category}
            </span>
          </motion.div>
        )}
        
        <motion.p 
          className="text-gray-300 text-sm md:text-base font-normal mb-6 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          viewport={{ once: true, margin: "50px" }}
        >
          {project.description}
        </motion.p>
        
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          viewport={{ once: true, margin: "50px" }}
        >
          <h4 className="text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wide">Technologies Used</h4>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, techIndex) => (
              <motion.span 
                key={techIndex} 
                className="px-3 py-1 bg-cyan-400/20 border border-cyan-400/50 rounded-full text-xs font-medium text-cyan-200 hover:bg-cyan-400/30 transition-colors duration-200"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15, delay: 0.25 + techIndex * 0.03 }}
                viewport={{ once: true, margin: "50px" }}
                whileHover={{ scale: 1.05 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="rounded-lg overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true, margin: "50px" }}
          whileHover={{ scale: 1.02 }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-48 md:h-64 lg:h-80 object-cover transition-transform duration-300"
            loading="lazy"
          />
        </motion.div>

        <motion.div 
          className="mt-6 grid grid-cols-3 gap-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          viewport={{ once: true, margin: "50px" }}
        >
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-cyan-400 font-bold text-lg">100%</div>
            <div className="text-gray-400 text-xs">Completion</div>
          </motion.div>
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-cyan-400 font-bold text-lg">{project.tech.length}</div>
            <div className="text-gray-400 text-xs">Technologies</div>
          </motion.div>
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-cyan-400 font-bold text-lg">{project.year}</div>
            <div className="text-gray-400 text-xs">Year</div>
          </motion.div>
        </motion.div>
      </motion.div>
    ),
  }));

  // Skills data
  const skillsData = {
    programming: [
      "C/C++", "Python", "PHP", "SQL", "SEPM", "HTML/CSS", "JavaScript", "Angular"
    ],
    skills: [
      "Frontend development", "UI/UX", "Operating Systems", "Penetration Testing", 
      "Cryptography", "Data Analysis", "DevOps"
    ],
    tools: [
      "Adobe XD", "Sketch"
    ]
  };

  // Certifications data
  const certifications = [
    { 
      name: "Deloitte Technology Job Simulation", 
      issuer: "Deloitte", 
      year: "2025",
      description: "Learned how to handle code merging of different tasks and designed Software project planning."
    },
    { 
      name: "IBM Cyber-Security Analyst", 
      issuer: "IBM", 
      year: "2024",
      description: "Learned Dynamic cyber workforce and tools for Data protection and Endpoint protection."
    },
    { 
      name: "Google Cloud Developer", 
      issuer: "Google Cloud", 
      year: "2023",
      description: "Application deployment environments on Google Cloud App Engine, Google Kubernetes Engine, and Compute Engine."
    },
    { 
      name: "AWS cloud Technical Essentials", 
      issuer: "Amazon Web Services", 
      year: "2023",
      description: "Understood AWS database and storage, RDS, Amazon DynamoDB, and Amazon S3, Amazon EC2, AWS Lambda, and Amazon ECS."
    }
  ];

  const education = [
    {
      degree: "B.Tech in Computer Science and Engineering w/s in cyber security",
      school: "S.R.M University",
      year: "2021 - 2025"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <SplashCursor />

      {/* Navigation */}
      <motion.nav 
        className={`fixed w-full z-50 transition-all duration-300 ${isScrolling ? 'bg-black/95 backdrop-blur-md' : 'bg-transparent'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-32 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Code2 className="w-8 h-8 text-cyan-400" />
              <span className="text-lg md:text-xl font-bold">Teach me - I remember, Involve me - I learn</span>
            </motion.div>
            <div className="hidden md:flex space-x-8">
              {['Home', 'Skills', 'Projects', 'Contact'].map((item, index) => (
                <motion.a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="hover:text-cyan-400 transition-colors duration-200"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.8}
            maxSize={1.6}
            particleDensity={40}
            className="w-full h-full"
            particleColor="#4feeff"
            speed={1.68}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        
        <div className="container mx-auto px-4 md:px-8 lg:px-32 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-left">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-4"
              >
                <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-300 mb-2">
                  Hello..! 
                </h2>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 name-glow">Sai Thoran</span> here
                  <motion.span 
                    className="inline-block ml-3 text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                    animate={{ 
                      rotate: [0, 14, -8, 14, -4, 10, 0],
                      scale: [1, 1.1, 1, 1.1, 1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                  >
                    👋🏻
                  </motion.span>
                </h1>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 h-16 md:h-20"
              >
                <TypeAnimation
                  sequence={[
                    'AI enthusiast',
                    2000,
                    'Cyber-Security',
                    2000,
                    'Cryptography & Steganography',
                    2000,
                    'Frontend developer',
                    2000,
                    'Ui/UX Designer',
                    2000
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="font-medium"
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="flex flex-wrap gap-3 md:gap-4"
              >
                <motion.a 
                  href="https://www.linkedin.com/in/sai-thoran" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-button glow-button flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">LinkedIn</span>
                </motion.a>
                <motion.a 
                  href="https://github.com/ESaiThoran" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-button glow-button flex items-center space-x-2 border border-white/20 hover:border-cyan-400 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">GitHub</span>
                </motion.a>
                <motion.a 
                  href="https://github.com/ESaiThoran/My-certificate/blob/main/README.md" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-button glow-button flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FileText className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">Resume/CV</span>
                </motion.a>
                <motion.div 
                  className="relative email-button-container"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <MagicTextReveal
                    text="esaithoran1@gmail.com"
                    color="rgba(255, 255, 255, 1)"
                    fontSize={14}
                    fontWeight={500}
                    spread={15}
                    speed={0.5}
                    density={2}
                    resetOnMouseLeave={true}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(5px)',
                      minWidth: '250px',
                      minHeight: '45px',
                      paddingTop: '20px',
                      cursor: 'default',
                    }}
                  />
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-white absolute left-3 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none neon-gmail-icon" />
                </motion.div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex justify-center lg:justify-end"
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" 
                  alt="Sai Thoran" 
                  className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full shadow-2xl border-4 border-cyan-400/30"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative" ref={aboutRef}>
        <LampContainer>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-transparent"
          >
            I ' am
          </motion.h2>
          
          <div className="max-w-4xl mx-auto px-4">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
              className="text-slate-300 mb-6 text-base md:text-lg leading-relaxed"
            >
              the one with curious in tech, has good skills in Cyber security, AI/ML, Web Development, UI/UX design and Cloud. with Interest I've build impactful projects like JARVIS, Phishing Detection Chrome Extension using AI. Cryptography and Steganography and Emotion recognition.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              className="text-slate-300 mb-8 text-base md:text-lg leading-relaxed"
            >
              Certification from IBM, AWS, Google Cloud, and Deloitte.I continuously strive to innovate and apply emerging technologies to solve real-world challenges. I bring a deep curiosity and a problem-solving mindset to every project I work on.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={aboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
              className="mt-12"
            >
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="education-card hover:border-cyan-400 transition-all duration-300 px-8 py-6 rounded-xl relative flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/20">
                    <motion.div 
                      className="flex items-start space-x-4"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <GraduationCap className="rotating-hat w-6 h-6 md:w-8 md:h-8 text-cyan-400 flex-shrink-0 mt-1" />
                      <div className="text-left">
                        <h3 className="text-xl md:text-2xl font-bold mb-2 text-slate-200">Education</h3>
                        <h4 className="text-lg md:text-xl font-bold mb-2 text-slate-300">{edu.degree}</h4>
                        <p className="text-slate-400">{edu.school}</p>
                        <p className="text-cyan-400 mt-1">{edu.year}</p>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </LampContainer>
      </section>

      {/* Skills and Projects Section */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(0, 0, 0)"
        gradientBackgroundEnd="rgb(30, 30, 60)"
        firstColor="79, 238, 255"
        secondColor="59, 130, 246"
        thirdColor="147, 51, 234"
        fourthColor="236, 72, 153"
        fifthColor="251, 146, 60"
        pointerColor="79, 238, 255"
        size="60%"
        blendingValue="multiply"
        interactive={false}
      >
        {/* OPTIMIZED Skills Section - Smooth animations */}
        <section id="skills" className="relative -mt-32" ref={skillsRef}>
          <ContainerScroll
            titleComponent={
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <h1 className="text-3xl md:text-4xl font-semibold text-white">
                  Technical <br />
                  <span className="text-4xl md:text-5xl lg:text-6xl font-bold mt-1 leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Skills
                  </span>
                </h1>
              </motion.div>
            }
          >
            <motion.div 
              className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden p-4 md:p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={skillsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black opacity-90"></div>
              
              <div className="relative z-10 space-y-6 md:space-y-8">
                {/* Programming Skills - Faster animations */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={skillsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.05, duration: 0.3, ease: "easeOut" }}
                  className="mb-6 md:mb-8"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-4 border-b border-cyan-400/30 pb-2">
                    Programming
                  </h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {skillsData.programming.map((skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={skillsInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.1 + index * 0.02, duration: 0.2, ease: "easeOut" }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="skill-tag px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer text-sm md:text-base"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Skills - Faster animations */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={skillsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                  className="mb-6 md:mb-8"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-green-400 mb-4 border-b border-green-400/30 pb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {skillsData.skills.map((skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={skillsInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.15 + index * 0.02, duration: 0.2, ease: "easeOut" }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="skill-tag px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer text-sm md:text-base"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Tools - Faster animations */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={skillsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
                  className="mb-6 md:mb-8"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-orange-400 mb-4 border-b border-orange-400/30 pb-2">
                    Tools
                  </h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {skillsData.tools.map((tool, index) => (
                      <motion.span
                        key={tool}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={skillsInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.2 + index * 0.02, duration: 0.2, ease: "easeOut" }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="skill-tag px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer text-sm md:text-base"
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className="absolute bottom-4 right-4 text-white/60 text-xs font-mono"
                initial={{ opacity: 0 }}
                animate={skillsInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                ~ Skills Acquired Through Practice ~
              </motion.div>
            </motion.div>
          </ContainerScroll>
        </section>

        {/* Projects Section */}
        <section id="projects" className="relative" ref={projectsRef}>
          <motion.div 
            className="flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={projectsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-full bg-transparent font-sans md:px-10">
              <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={projectsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-center"
                >
                  <h2 className="text-3xl md:text-5xl lg:text-6xl mb-4 text-white max-w-4xl font-bold mx-auto">
                    Projects
                  </h2>
                  <p className="text-gray-300 text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-12">
                    I've learned multiple skills and technologies
                  </p>
                </motion.div>
              </div>
              <Timeline data={timelineData} />
            </div>
          </motion.div>
        </section>
      </BackgroundGradientAnimation>

      {/* OPTIMIZED Certifications Section - Smooth and fast */}
      <section id="certifications" className="py-20 md:py-32 relative overflow-hidden min-h-screen" ref={certificationsRef}>
        {/* Static background image - no animation for better performance */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://i.pinimg.com/originals/b0/72/b4/b072b454c263e9ebe2ab3063b4907480.gif")',
            filter: 'brightness(4.0) contrast(1.0)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-gray-900/70 to-black/80" />
        
        <div className="container mx-auto px-4 md:px-8 lg:px-32 relative z-10 flex flex-col justify-center min-h-screen">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={certificationsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-20 text-white text-center"
          >
            Certifications
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {certifications.map((cert, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={certificationsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                className="cert-card-optimized p-6 md:p-8 rounded-3xl cursor-pointer group relative overflow-hidden min-h-[350px] flex flex-col"
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
              >
                {/* Static glass background - no complex animations */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl"></div>
                
                {/* Simple hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-3xl"></div>
                
                <div className="relative z-10 text-center flex flex-col h-full">
                  <div className="flex-1">
                    {/* Optimized badge with simple glow */}
                    <Award className="cert-badge-optimized w-10 h-10 md:w-12 md:h-12 text-gray-600 mb-6 mx-auto transition-all duration-200" />
                    <h3 className="text-base md:text-lg font-bold mb-3 text-gray-900 group-hover:text-gray-800 transition-colors duration-200 leading-tight">{cert.name}</h3>
                    <p className="text-sm text-gray-700 mb-2 group-hover:text-gray-600 transition-colors duration-200">{cert.issuer}</p>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center my-4">
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">{cert.description}</p>
                  </div>
                  
                  <div className="mt-auto">
                    <p className="text-amber-600 font-semibold group-hover:text-yellow-700 transition-colors duration-200 text-sm">{cert.year}</p>
                  </div>
                </div>

                {/* Simple shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative overflow-hidden" ref={contactRef}
          onMouseEnter={handleMouseMove} // Add this
          onMouseMove={handleMouseMove}  // Keep this
          onMouseLeave={handleMouseLeave}
        >
        <div className="absolute inset-0">
          <Squares 
            direction="diagonal"
            speed={0.1}
            squareSize={60}
            borderColor="#666666" 
            hoverFillColor="#333333"
          />
        </div>

        <div className="container mx-auto px-4 md:px-8 lg:px-32 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={contactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
          >
            Get in Touch
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={contactInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                I'm always interested in hearing about New Opportunities and Ideas.
                🧔🏻
                🤝
                🤔
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={contactInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex justify-center px-4 md:px-16"
            >
              <motion.div 
                className="jarvis-interface w-full max-w-lg pointer-events-auto"
                style={{ pointerEvents: 'auto' }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={(e) => {
                  handleMouseLeave(e);
                  setIsHovered(false);
                }}
                animate={{ scale: isHovered ? 1.04 : 1 }}
                transition={{ 
                  duration: 0.1,
                  ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for smoother animation
                }}
              >
                <div className="interface-header">
                  <h2>Send Your Response</h2>
                </div>
                <form 
                  id="jarvisForm"
                  action="https://docs.google.com/forms/d/e/1FAIpQLSdt4BlGBv9DlqhQZfr4BKUA1YgRjYUipiAiRZRZKw7y-54bgQ/formResponse"
                  method="POST"
                  onSubmit={handleFormSubmit}
                >
                  <motion.div 
                    className="input-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={contactInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <input type="text" name="entry.1400455273" placeholder=" " required />
                    <label>Name</label>
                  </motion.div>
                  <motion.div 
                    className="input-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={contactInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <input type="text" name="entry.2072079095" placeholder=" " required />
                    <label>Mail / Phone</label>
                  </motion.div>
                  <motion.div 
                    className="input-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={contactInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <textarea name="entry.881789676" placeholder=" " required></textarea>
                    <label>What's in your Mind...</label>
                  </motion.div>
                  <motion.button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: submitStatus === 'success' ? '#10b981' : undefined,
                      opacity: isSubmitting ? 0.8 : 1
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={contactInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {getButtonText()}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900">
        <div className="container mx-auto px-4 md:px-8 lg:px-32 text-center text-gray-400">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            © {new Date().getFullYear()} Sai Thoran. All rights reserved.
          </motion.p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-6 md:bottom-8 right-6 md:right-8 p-3 md:p-4 bg-cyan-500 text-white rounded-full shadow-lg hover:bg-cyan-600 transition-colors duration-200 back-to-top z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>
      )}
    </div>
  );
}

export default App;