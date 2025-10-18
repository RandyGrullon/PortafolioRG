'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ParallaxProvider } from 'react-scroll-parallax';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, Briefcase, Mail, Palette, LogOut, ArrowLeft, Menu, X } from 'lucide-react';
import { HeroManager } from '@/components/admin/HeroManager';
import { ProjectManager } from '@/components/admin/ProjectManager';
import { AboutManager } from '@/components/admin/AboutManager';
import { ExperienceManager } from '@/components/admin/ExperienceManager';
import { ContactManager } from '@/components/admin/ContactManager';
import { GeneralSettingsManager } from '@/components/admin/GeneralSettingsManager';

export default function AdminPage() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('hero');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // Don't redirect, just show login screen
      return;
    }
  }, [user, loading]);

  const navigationItems = [
    { id: 'hero', label: 'Hero', icon: User, description: 'Main hero section' },
    { id: 'projects', label: 'Projects', icon: Briefcase, description: 'Portfolio projects' },
    { id: 'about', label: 'About', icon: User, description: 'Personal information' },
    { id: 'experience', label: 'Experience', icon: Briefcase, description: 'Professional experience' },
    { id: 'contact', label: 'Contact', icon: Mail, description: 'Contact information' },
    { id: 'settings', label: 'Settings', icon: Palette, description: 'General settings' },
  ];

  const renderSidebar = () => (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-card/95 backdrop-blur-xl border-r border-border/50 transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:hidden
    `}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Admin Panel</h2>
              <p className="text-xs text-foreground/60">Portfolio Manager</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false); // Close sidebar on mobile after selection
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200
                  ${activeTab === item.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent/10'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.label}</div>
                  <div className="text-xs opacity-70 truncate">{item.description}</div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border/50 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.displayName}</p>
              <p className="text-xs text-foreground/60 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-6 mb-8 bg-card/50 backdrop-blur-sm border border-border/50 p-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="hero">
        <HeroManager />
      </TabsContent>
      <TabsContent value="projects">
        <ProjectManager />
      </TabsContent>
      <TabsContent value="about">
        <AboutManager />
      </TabsContent>
      <TabsContent value="experience">
        <ExperienceManager />
      </TabsContent>
      <TabsContent value="contact">
        <ContactManager />
      </TabsContent>
      <TabsContent value="settings">
        <GeneralSettingsManager />
      </TabsContent>
    </Tabs>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-lg text-foreground/80">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background relative overflow-x-hidden">
        {/* Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-background via-background to-accent/5"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Admin Access Required</h1>
              <p className="text-foreground/70">Sign in with Google to access the admin panel and manage your portfolio.</p>
            </div>
            <Button onClick={signInWithGoogle} className="w-full">
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      <div className="lg:pl-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border/50">
          <div className="flex items-center justify-between px-4 py-4 lg:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="lg:hidden">
                <h1 className="text-xl font-bold text-foreground">
                  {navigationItems.find(item => item.id === activeTab)?.label || 'Admin Panel'}
                </h1>
                <p className="text-sm text-foreground/60">
                  {navigationItems.find(item => item.id === activeTab)?.description || 'Manage your portfolio'}
                </p>
              </div>
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-sm text-foreground/60">Manage your portfolio content</p>
              </div>
            </div>
            <Button onClick={() => router.push('/')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Desktop: Tabs */}
            <div className="hidden lg:block">
              {renderTabs()}
            </div>
            {/* Mobile: Conditional content */}
            <div className="lg:hidden">
              {activeTab === 'hero' && <HeroManager />}
              {activeTab === 'projects' && <ProjectManager />}
              {activeTab === 'about' && <AboutManager />}
              {activeTab === 'experience' && <ExperienceManager />}
              {activeTab === 'contact' && <ContactManager />}
              {activeTab === 'settings' && <GeneralSettingsManager />}
            </div>
          </div>
        </main>
      </div>
    </div>
    </ParallaxProvider>
  );
}