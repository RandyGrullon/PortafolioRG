export interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  imageUrl: string;
  galleryImages?: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  createdAt: Date;
}

export interface AboutData {
  bio: string;
  skills: string[];
  education: string;
}

export interface HeroData {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
  projectsCount: string;
  profileImageUrl?: string;
}

export interface ExperienceData {
  currentPosition: string;
  currentCompany: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format or empty for current
  professionalSummary: string;
  technologies: string[];
  previousExperience: PreviousExperience[];
}

export interface PreviousExperience {
  position: string;
  company: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  description: string;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  whatsappNumber: string;
  contactTitle: string;
  contactSubtitle: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface SettingsData {
  siteTitle: string;
  siteDescription: string;
  projectsTitle: string;
  projectsSubtitle: string;
  aboutTitle: string;
  aboutSubtitle: string;
  contactDescription: string;
  showWhatsApp: boolean;
  showSocialLinks: boolean;
  maintenanceMode: boolean;
  customCss: string;
}