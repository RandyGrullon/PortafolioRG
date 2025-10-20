'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Code, User, Mail, ChevronUp, Award, Sun, Moon } from 'lucide-react';

interface NavigationProps {
  heroRef: React.RefObject<HTMLElement>;
  projectsRef: React.RefObject<HTMLElement>;
  aboutRef: React.RefObject<HTMLElement>;
  experienceRef: React.RefObject<HTMLElement>;
  contactRef: React.RefObject<HTMLElement>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function Navigation({ heroRef, projectsRef, aboutRef, experienceRef, contactRef, theme, toggleTheme }: NavigationProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) setActiveSection('hero');
            else if (entry.target === projectsRef.current) setActiveSection('projects');
            else if (entry.target === aboutRef.current) setActiveSection('about');
            else if (entry.target === experienceRef.current) setActiveSection('experience');
            else if (entry.target === contactRef.current) setActiveSection('contact');
          }
        });
      },
      { threshold: 0.5, rootMargin: '-50% 0px -50% 0px' } // Trigger when section is in the middle
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (projectsRef.current) observer.observe(projectsRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);
    if (experienceRef.current) observer.observe(experienceRef.current);
    if (contactRef.current) observer.observe(contactRef.current);

    return () => observer.disconnect();
  }, [heroRef, projectsRef, aboutRef, experienceRef, contactRef]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTop = () => {
    scrollToSection(heroRef);
  };

  return (
    <>
      {/* Theme Toggle Button - Desktop */}
      <div className="fixed top-6 right-6 z-50 hidden lg:flex">
        <Button
          variant="outline"
          size="sm"
          className="w-12 h-12 rounded-full p-0"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      {/* Floating Navigation */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        <Button
          variant={activeSection === 'hero' ? 'default' : 'outline'}
          size="sm"
          className="w-12 h-12 rounded-full p-0"
          onClick={() => { scrollToTop(); setActiveSection('hero'); }}
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
        <Button
          variant={activeSection === 'projects' ? 'default' : 'outline'}
          size="sm"
          className="w-12 h-12 rounded-full p-0"
          onClick={() => { scrollToSection(projectsRef); setActiveSection('projects'); }}
        >
          <Code className="w-5 h-5" />
        </Button>
        <Button
          variant={activeSection === 'about' ? 'default' : 'outline'}
          size="sm"
          className="w-12 h-12 rounded-full p-0"
          onClick={() => { scrollToSection(aboutRef); setActiveSection('about'); }}
        >
          <User className="w-5 h-5" />
        </Button>
        <Button
          variant={activeSection === 'experience' ? 'default' : 'outline'}
          size="sm"
          className="w-12 h-12 rounded-full p-0"
          onClick={() => { scrollToSection(experienceRef); setActiveSection('experience'); }}
        >
          <Award className="w-5 h-5" />
        </Button>
        <Button
          variant={activeSection === 'contact' ? 'default' : 'outline'}
          size="sm"
          className="w-12 h-12 rounded-full p-0"
          onClick={() => { scrollToSection(contactRef); setActiveSection('contact'); }}
        >
          <Mail className="w-5 h-5" />
        </Button>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full p-0 lg:hidden"
          onClick={() => { scrollToTop(); setActiveSection('hero'); }}
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