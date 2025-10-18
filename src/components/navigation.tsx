'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Briefcase, User, Mail, ChevronUp, Sun, Moon } from 'lucide-react';

interface NavigationProps {
  projectsRef: React.RefObject<HTMLElement>;
  aboutRef: React.RefObject<HTMLElement>;
  experienceRef: React.RefObject<HTMLElement>;
  contactRef: React.RefObject<HTMLElement>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function Navigation({ projectsRef, aboutRef, experienceRef, contactRef, theme, toggleTheme }: NavigationProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      // Check which section is currently visible
      const heroSection = document.getElementById('hero');
      const projectsSection = projectsRef.current;
      const aboutSection = aboutRef.current;
      const experienceSection = experienceRef.current;
      const contactSection = contactRef.current;

      if (contactSection && scrollPosition >= contactSection.offsetTop) {
        setActiveSection('contact');
      } else if (experienceSection && scrollPosition >= experienceSection.offsetTop) {
        setActiveSection('experience');
      } else if (aboutSection && scrollPosition >= aboutSection.offsetTop) {
        setActiveSection('about');
      } else if (projectsSection && scrollPosition >= projectsSection.offsetTop) {
        setActiveSection('projects');
      } else if (heroSection && scrollPosition >= heroSection.offsetTop) {
        setActiveSection('hero');
      }

      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [projectsRef, aboutRef, experienceRef, contactRef]);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Navigation */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        <Button
          variant="outline"
          size="sm"
          className="w-12 h-12 rounded-full p-0"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <Button
          variant={activeSection === 'hero' ? 'default' : 'outline'}
          size="sm"
          className="w-12 h-12 rounded-full p-0"
          onClick={scrollToTop}
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
        <Button
          variant={activeSection === 'projects' ? 'default' : 'outline'}
          size="sm"
          className="w-12 h-12 rounded-full p-0"
          onClick={() => scrollToSection(projectsRef)}
        >
          <Briefcase className="w-5 h-5" />
        </Button>
        <Button
          variant={activeSection === 'about' ? 'default' : 'outline'}
          size="sm"
          className="w-12 h-12 rounded-full p-0"
          onClick={() => scrollToSection(aboutRef)}
        >
          <User className="w-5 h-5" />
        </Button>
        <Button
          variant={activeSection === 'experience' ? 'default' : 'outline'}
          size="sm"
          className="w-12 h-12 rounded-full p-0"
          onClick={() => scrollToSection(experienceRef)}
        >
          <Briefcase className="w-5 h-5" />
        </Button>
        <Button
          variant={activeSection === 'contact' ? 'default' : 'outline'}
          size="sm"
          className="w-12 h-12 rounded-full p-0"
          onClick={() => scrollToSection(contactRef)}
        >
          <Mail className="w-5 h-5" />
        </Button>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full p-0 lg:hidden"
          onClick={scrollToTop}
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
      )}

      {/* Theme Toggle Button - Mobile */}
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full p-0 lg:hidden"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>
    </>
  );
}