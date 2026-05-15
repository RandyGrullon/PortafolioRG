"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { Navigation } from "@/components/navigation";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Project,
  AboutData,
  HeroData,
  ExperienceData,
  ContactData,
  SettingsData,
} from "@/lib/types";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Settings,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const developerImage = PlaceHolderImages.find(
    (p) => p.id === "developer-portrait"
  );
  const { user, signInWithGoogle, logout } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [experienceData, setExperienceData] = useState<ExperienceData | null>(
    null
  );
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [aboutLoading, setAboutLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);
  const [experienceLoading, setExperienceLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [imageClickCount, setImageClickCount] = useState(0);
  const [showClickIndicator, setShowClickIndicator] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizeExperienceData = (data: any): ExperienceData => {
    const positionsFromNew = Array.isArray(data?.positions) ? data.positions : [];

    let positions = positionsFromNew?.length ? positionsFromNew : [];

    if (!positions.length && data) {
      const legacyPositions: ExperienceData["positions"] = [];

      if (data.currentPosition || data.currentCompany || data.startDate || data.endDate) {
        legacyPositions.push({
          position: data.currentPosition || "",
          company: data.currentCompany || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          description: data.professionalSummary || "",
        });
      }

      if (Array.isArray(data.previousExperience)) {
        legacyPositions.push(
          ...data.previousExperience.map((exp: any) => ({
            position: exp.position || "",
            company: exp.company || "",
            startDate: exp.startDate || "",
            endDate: exp.endDate || "",
            description: exp.description || "",
          }))
        );
      }

      positions = legacyPositions;
    }

    return {
      professionalSummary: data?.professionalSummary || "",
      technologies: data?.technologies || [],
      positions,
      yearsOfExperience: data?.yearsOfExperience,
    };
  };

  const { currentExperience, previousExperiences } = useMemo(() => {
    if (!experienceData?.positions?.length) {
      return { currentExperience: null, previousExperiences: [] };
    }

    const sorted = [...experienceData.positions].sort((a, b) => {
      const endA = a.endDate ? new Date(a.endDate).getTime() : Number.POSITIVE_INFINITY;
      const endB = b.endDate ? new Date(b.endDate).getTime() : Number.POSITIVE_INFINITY;

      if (endA === endB) {
        const startA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const startB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return startB - startA;
      }

      return endB - endA;
    });

    const currentIndex = sorted.findIndex(exp => !exp.endDate);
    const chosenIndex = currentIndex !== -1 ? currentIndex : 0;

    const current = sorted[chosenIndex] ?? null;
    const previous = sorted.filter((_, idx) => idx !== chosenIndex);

    return { currentExperience: current, previousExperiences: previous };
  }, [experienceData?.positions]);

  // Section refs for smooth scrolling
  const heroRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchProjects(),
        fetchAboutData(),
        fetchHeroData(),
        fetchExperienceData(),
        fetchContactData(),
        fetchSettings(),
      ]);
    };

    fetchAllData();
  }, []);

  // Set page title and inject custom CSS
  useEffect(() => {
    if (settings) {
      document.title = settings.siteTitle;

      // Set meta description
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", settings.siteDescription);
      }

      // Inject custom CSS
      if (settings.customCss) {
        const style = document.createElement("style");
        style.textContent = settings.customCss;
        style.id = "custom-css";
        document.head.appendChild(style);

        return () => {
          const existing = document.getElementById("custom-css");
          if (existing) existing.remove();
        };
      }
    }
  }, [settings]);

  // Apply theme
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
          images: data.images || (data.imageUrl ? [data.imageUrl] : []),
          technologies: data.technologies || [],
          githubUrl: data.githubUrl || null,
          liveUrl: data.liveUrl || null,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        };
      }) as Project[];
      setProjects(projectsData);
      console.log("Projects loaded from Firebase:", projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchAboutData = async () => {
    try {
      const docRef = doc(db, "about", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAboutData(docSnap.data() as AboutData);
      } else {
        setAboutData(null);
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setAboutLoading(false);
    }
  };

  const fetchExperienceData = async () => {
    try {
      const docRef = doc(db, "experience", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setExperienceData(normalizeExperienceData(docSnap.data()));
      } else {
        setExperienceData(null);
      }
    } catch (error) {
      console.error("Error fetching experience data:", error);
    } finally {
      setExperienceLoading(false);
    }
  };

  const fetchHeroData = async () => {
    try {
      const docRef = doc(db, "content", "hero");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHeroData(docSnap.data() as HeroData);
      } else {
        setHeroData(null);
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
    } finally {
      setHeroLoading(false);
    }
  };

  const fetchContactData = async () => {
    try {
      const docRef = doc(db, "content", "contact");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();

        // Handle migration from old structure
        const migratedData: ContactData = {
          email: data.email || "randy.grullon@example.com",
          phone: data.phone || "+1 (555) 123-4567",
          location: data.location || "Santo Domingo, Dominican Republic",
          whatsappNumber: data.whatsappNumber || "+18091234567",
          contactTitle: data.contactTitle || "Let's Connect",
          contactSubtitle: data.contactSubtitle || "Get In Touch",
          socialLinks: data.socialLinks || {
            linkedin:
              data.linkedinUrl || "https://linkedin.com/in/randy-grullon",
            github: data.githubUrl || "https://github.com/randy-grullon",
            twitter: data.twitterUrl || "https://twitter.com/randy_grullon",
            instagram: data.instagramUrl || "",
          },
        };

        setContactData(migratedData);
      } else {
        setContactData(null);
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setContactLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SettingsData);
      } else {
        setSettings(null);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        alert("Thank you for your message! I will get back to you soon.");
        setContactForm({ name: "", email: "", message: "" });
      } else {
        alert("There was an issue sending your message. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending form:", error);
      alert("Connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageClick = () => {
    const newCount = imageClickCount + 1;
    setImageClickCount(newCount);
    setShowClickIndicator(true);

    // Hide indicator after 1 second
    setTimeout(() => {
      setShowClickIndicator(false);
    }, 1000);

    if (newCount >= 5) {
      // Reset counter and navigate to admin
      setImageClickCount(0);
      router.push("/admin");
    } else {
      // Reset counter after 3 seconds of no clicks
      setTimeout(() => {
        setImageClickCount(0);
      }, 3000);
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  // Smooth scroll function
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Check for maintenance mode
  if (!settingsLoading && settings?.maintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Under Maintenance
            </h1>
            <p className="text-foreground/70">
              We&apos;re currently performing maintenance on the site. Please
              check back soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative overflow-x-hidden snap-y snap-mandatory">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background via-background to-accent/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex items-center snap-start"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95"></div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="order-2 lg:order-1">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                  {heroLoading ? "" : heroData?.status || ""}
                </div>
                <h1 className="font-headline text-5xl lg:text-7xl xl:text-8xl font-bold leading-none tracking-tight">
                  <span className="block text-foreground">
                    {heroLoading ? "" : heroData?.subtitle || ""}
                  </span>
                  <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    {heroLoading ? "" : heroData?.name || ""}
                  </span>
                  <span className="block text-2xl lg:text-3xl xl:text-4xl font-medium text-foreground/80 mt-4">
                    {heroLoading ? "" : heroData?.title || ""}
                  </span>
                </h1>
              </div>

              <p className="text-lg lg:text-xl text-foreground/70 leading-relaxed max-w-xl">
                {heroLoading ? "" : heroData?.description || ""}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="group relative overflow-hidden"
                  onClick={() => scrollToSection(projectsRef)}
                >
                  <span className="relative z-10">View My Work</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
                <Button variant="outline" size="lg" className="group">
                  <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Get In Touch
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-8">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background"></div>
                  <div className="w-8 h-8 rounded-full bg-accent/20 border-2 border-background"></div>
                  <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-background"></div>
                </div>
                <div className="text-sm text-foreground/60">
                  <span className="font-medium text-foreground">
                    {heroLoading ? "" : heroData?.projectsCount || ""}
                  </span>{" "}
                  Projects Completed
                </div>
              </div>

              {/* Social Links */}
              {!settingsLoading && settings?.showSocialLinks && (
                <div className="flex items-center gap-4 pt-6">
                  <span className="text-sm text-foreground/60">Follow me:</span>
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 p-0 rounded-full hover:bg-primary/10"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 p-0 rounded-full hover:bg-primary/10"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 p-0 rounded-full hover:bg-primary/10"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl"></div>
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 p-8">
                  {(heroData?.profileImageUrl || developerImage?.imageUrl) && (
                    <Image
                      src={
                        heroData?.profileImageUrl ||
                        developerImage?.imageUrl ||
                        ""
                      }
                      alt={
                        heroData?.name ||
                        developerImage?.description ||
                        "Profile image"
                      }
                      width={600}
                      height={600}
                      className="w-full h-auto object-contain rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
                      data-ai-hint={
                        developerImage?.imageHint || "profile image"
                      }
                      priority
                      onClick={handleImageClick}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent rounded-2xl"></div>
                  {/* Easter egg progress indicator */}
                  {showClickIndicator &&
                    imageClickCount > 0 &&
                    imageClickCount < 5 && (
                      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 border border-primary/20">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-primary font-medium">
                            {imageClickCount}/5
                          </span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                                  i < imageClickCount
                                    ? "bg-primary"
                                    : "bg-primary/20"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>{" "}
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-bounce delay-500"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/10 rounded-full blur-xl animate-bounce delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="relative">
        {/* Projects Section */}
        <section
          id="projects"
          ref={projectsRef}
          className="min-h-screen flex items-center snap-start px-6 lg:px-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Featured Work
              </div>
              <h2 className="font-headline text-4xl lg:text-6xl font-bold mb-6">
                {settingsLoading ? "" : settings?.projectsTitle || ""}
              </h2>
              <p className="text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
                {settingsLoading ? "" : settings?.projectsSubtitle || ""}
              </p>
            </div>

            {projectsLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                  {projects.slice(0, 4).map((project) => (
                    <Card
                      key={project.id}
                      className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 transform group-hover:scale-[1.02] group-hover:-translate-y-1 cursor-pointer relative"
                    >
                      <div className="relative">
                        <Link
                          href={`/projects/${project.id}`}
                          className="block h-full"
                        >
                          <CardHeader className="p-0">
                            <div className="relative h-48 overflow-hidden rounded-t-lg">
                              {project.images && project.images.length > 0 && (
                                <Image
                                  src={project.images[0]}
                                  alt={project.title}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-6">
                            <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                              {project.title}
                            </CardTitle>
                            <CardDescription className="mb-4 leading-relaxed">
                              {project.description}
                            </CardDescription>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Link>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <div className="flex gap-2">
                            {project.githubUrl && (
                              <Button
                                asChild
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0"
                              >
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  GitHub
                                </a>
                              </Button>
                            )}
                            {project.liveUrl && (
                              <Button asChild size="sm" className="h-8 w-8 p-0">
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Live
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {projects.length > 0 && (
                  <div className="text-center mt-12">
                    <Button asChild size="lg" className="px-8 py-3">
                      <Link href="/projects">View All Projects</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          ref={aboutRef}
          className="min-h-screen flex items-center snap-start px-6 lg:px-12 bg-gradient-to-b from-background to-background/50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                About Me
              </div>
              <h2 className="font-headline text-4xl lg:text-6xl font-bold mb-6">
                {settingsLoading ? "" : settings?.aboutTitle || ""}
              </h2>
              <p className="text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
                {settingsLoading ? "" : settings?.aboutSubtitle || ""}
              </p>
            </div>

            {aboutLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-accent/20 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent rounded-full animate-spin"></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                        <span className="text-accent font-bold">B</span>
                      </div>
                      Biography
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 leading-relaxed">
                      {aboutData?.bio}
                    </p>
                  </CardContent>
                </Card>

                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-bold">S</span>
                      </div>
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {aboutData?.skills.map((skill: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300 px-3 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-bold">G</span>
                      </div>
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 leading-relaxed">
                      {aboutData?.education}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Experience Section */}
        <section
          id="experience"
          ref={experienceRef}
          className="min-h-screen flex items-center snap-start px-6 lg:px-12 bg-gradient-to-b from-background/50 to-background"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Experience
              </div>
              <h2 className="font-headline text-4xl lg:text-6xl font-bold mb-6">
                Professional Journey
              </h2>
              <p className="text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
                Discover my career path and the experiences that have shaped my
                development expertise.
              </p>
            </div>

            {experienceLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                </div>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/50 hidden lg:block"></div>

                <div className="space-y-16">
                  {/* Highlighted Position */}
                  <div className="relative flex items-start gap-8">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg z-10">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <Card className="flex-1 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 group">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            {currentExperience?.endDate ? "Latest" : "Current"}
                          </Badge>
                          <span className="text-sm text-foreground/60">
                            {currentExperience?.startDate
                              ? new Date(currentExperience.startDate).getFullYear()
                              : ""}
                            {" "}- {currentExperience?.endDate
                              ? new Date(currentExperience.endDate).getFullYear()
                              : "Present"}
                          </span>
                        </div>
                        <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                          {currentExperience?.position || "Position Title"}
                        </CardTitle>
                        <p className="text-lg text-foreground/80 font-medium">
                          {currentExperience?.company || "Company Name"}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/80 leading-relaxed mb-6">
                          {currentExperience?.description ||
                            experienceData?.professionalSummary ||
                            "Professional summary will appear here..."}
                        </p>
                        {experienceData?.technologies &&
                          experienceData.technologies.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-foreground/70 mb-3 uppercase tracking-wide">
                                Key Technologies
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {experienceData.technologies.map(
                                  (tech, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
                                    >
                                      {tech}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Previous Experience */}
                  {previousExperiences.length > 0 && (
                    <>
                      {previousExperiences.map((exp, index) => (
                        <div
                          key={`${exp.position}-${index}`}
                          className="relative flex items-start gap-8"
                        >
                          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-lg z-10">
                            <span className="text-white font-bold text-xl">
                              {index + 1}
                            </span>
                          </div>
                          <Card className="flex-1 bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 group">
                            <CardHeader className="pb-4">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge
                                  variant="outline"
                                  className="border-accent/20 text-accent"
                                >
                                  {exp.startDate
                                    ? new Date(exp.startDate).getFullYear()
                                    : ""}{" "}
                                  - {exp.endDate
                                    ? new Date(exp.endDate).getFullYear()
                                    : "Present"}
                                </Badge>
                              </div>
                              <CardTitle className="text-2xl group-hover:text-accent transition-colors">
                                {exp.position}
                              </CardTitle>
                              <p className="text-lg text-foreground/80 font-medium">
                                {exp.company}
                              </p>
                            </CardHeader>
                            <CardContent>
                              <p className="text-foreground/80 leading-relaxed">
                                {exp.description}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          ref={contactRef}
          className="min-h-screen flex items-center snap-start px-6 lg:px-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                {contactLoading ? "" : contactData?.contactTitle || ""}
              </div>
              <h2 className="font-headline text-4xl lg:text-6xl font-bold mb-6">
                {contactLoading ? "" : contactData?.contactSubtitle || ""}
              </h2>
              <p className="text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
                {settingsLoading ? "" : settings?.contactDescription || ""}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors">
                    <Mail className="h-6 w-6 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-foreground/80">
                        {contactLoading
                          ? "randy.grullon@example.com"
                          : contactData?.email || "randy.grullon@example.com"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors">
                    <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <p className="text-foreground/80">
                        {contactLoading
                          ? "+1 (555) 123-4567"
                          : contactData?.phone || "+1 (555) 123-4567"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors">
                    <MapPin className="h-6 w-6 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Location</p>
                      <p className="text-foreground/80">
                        {contactLoading
                          ? "Santo Domingo, Dominican Republic"
                          : contactData?.location ||
                            "Santo Domingo, Dominican Republic"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-6">
                    <WhatsAppButton
                      phoneNumber={
                        contactLoading
                          ? "+18091234567"
                          : contactData?.whatsappNumber || "+18091234567"
                      }
                      show={
                        settingsLoading
                          ? true
                          : settings?.showWhatsApp !== false
                      }
                    />
                  </div>
                  {settings?.showSocialLinks && contactData?.socialLinks && (
                    <div className="pt-6">
                      <p className="font-medium text-foreground mb-4">
                        Follow Me
                      </p>
                      <div className="flex gap-4">
                        {contactData.socialLinks.github && (
                          <a
                            href={contactData.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-foreground/10 hover:bg-foreground/20 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {contactData.socialLinks.linkedin && (
                          <a
                            href={contactData.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-foreground/10 hover:bg-foreground/20 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {contactData.socialLinks.twitter && (
                          <a
                            href={contactData.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-foreground/10 hover:bg-foreground/20 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                        {contactData.socialLinks.instagram && (
                          <a
                            href={contactData.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-foreground/10 hover:bg-foreground/20 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    Send a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-foreground/80">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={contactForm.name}
                          onChange={handleContactChange}
                          className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-foreground/80">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-foreground/80">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        rows={5}
                        className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors resize-none"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full group relative overflow-hidden"
                    >
                      <span className="relative z-10">{isSubmitting ? "Sending..." : "Send Message"}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Admin Access
        <div className="py-16 px-6 lg:px-12 bg-gradient-to-t from-background to-background/50">
          <div className="max-w-4xl mx-auto text-center">
            {!user ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group relative overflow-hidden"
                  >
                    <Settings className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" />
                    <span className="relative z-10">Admin Panel</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/50">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Admin Access Required
                    </DialogTitle>
                  </DialogHeader>
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Settings className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-foreground/80 mb-6 leading-relaxed">
                      Sign in with Google to access the admin panel and manage
                      your portfolio.
                    </p>
                    <Button
                      onClick={signInWithGoogle}
                      className="w-full group relative overflow-hidden"
                    >
                      <span className="relative z-10">Sign in with Google</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : user.email === "randy.grullon@example.com" ||
              user.displayName === "Randy Grullon" ? (
              <div className="space-y-6">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Welcome back, {user.displayName}!
                  </h3>
                  <p className="text-foreground/70">
                    Manage your portfolio content
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="group relative overflow-hidden"
                  >
                    <Link href="/admin">
                      <Settings className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" />
                      <span className="relative z-10">Go to Admin Panel</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </Button>
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="lg"
                    className="group relative overflow-hidden border-red-500/20 text-red-500 hover:bg-red-500/10"
                  >
                    <span className="relative z-10">Logout</span>
                    <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
                  <Settings className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-red-500">
                    Access Denied
                  </h3>
                  <p className="text-foreground/70">
                    You don&apos;t have permission to access the admin panel.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div> */}
      </div>
      <Navigation
        heroRef={heroRef}
        projectsRef={projectsRef}
        aboutRef={aboutRef}
        experienceRef={experienceRef}
        contactRef={contactRef}
        theme={resolvedTheme}
        toggleTheme={toggleTheme}
      />
    </main>
  );
}
