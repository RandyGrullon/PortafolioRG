'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Parallax } from 'react-scroll-parallax';
import { Palette, Save, Globe } from 'lucide-react';

interface GeneralSettings {
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

export function GeneralSettingsManager() {
  const [settings, setSettings] = useState<GeneralSettings>({
    siteTitle: '',
    siteDescription: '',
    projectsTitle: '',
    projectsSubtitle: '',
    aboutTitle: '',
    aboutSubtitle: '',
    contactDescription: '',
    showWhatsApp: true,
    showSocialLinks: true,
    maintenanceMode: false,
    customCss: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'general');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as GeneralSettings;
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <Parallax translateY={[10, -10]}>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-accent" />
            </div>
            General Settings
          </CardTitle>
          <p className="text-foreground/70">Configure site-wide settings and content</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Site Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Site Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siteTitle">Site Title (SEO)</Label>
                <Input
                  id="siteTitle"
                  name="siteTitle"
                  value={settings.siteTitle}
                  onChange={handleInputChange}
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description (SEO)</Label>
                <Input
                  id="siteDescription"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleInputChange}
                  className="bg-background/50"
                />
              </div>
            </div>
          </div>

          {/* Section Titles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Section Titles</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="projectsTitle">Projects Section Title</Label>
                  <Input
                    id="projectsTitle"
                    name="projectsTitle"
                    value={settings.projectsTitle}
                    onChange={handleInputChange}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="projectsSubtitle">Projects Section Subtitle</Label>
                  <Textarea
                    id="projectsSubtitle"
                    name="projectsSubtitle"
                    value={settings.projectsSubtitle}
                    onChange={handleInputChange}
                    rows={2}
                    className="bg-background/50 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="aboutTitle">About Section Title</Label>
                  <Input
                    id="aboutTitle"
                    name="aboutTitle"
                    value={settings.aboutTitle}
                    onChange={handleInputChange}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="aboutSubtitle">About Section Subtitle</Label>
                  <Textarea
                    id="aboutSubtitle"
                    name="aboutSubtitle"
                    value={settings.aboutSubtitle}
                    onChange={handleInputChange}
                    rows={2}
                    className="bg-background/50 resize-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="contactDescription">Contact Section Description</Label>
              <Textarea
                id="contactDescription"
                name="contactDescription"
                value={settings.contactDescription}
                onChange={handleInputChange}
                rows={2}
                className="bg-background/50 resize-none"
              />
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50">
                <div>
                  <Label htmlFor="showWhatsApp" className="text-sm font-medium">WhatsApp Button</Label>
                  <p className="text-xs text-foreground/70">Show floating WhatsApp button</p>
                </div>
                <Switch
                  id="showWhatsApp"
                  checked={settings.showWhatsApp}
                  onCheckedChange={(checked) => handleSwitchChange('showWhatsApp', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50">
                <div>
                  <Label htmlFor="showSocialLinks" className="text-sm font-medium">Social Links</Label>
                  <p className="text-xs text-foreground/70">Show social media links</p>
                </div>
                <Switch
                  id="showSocialLinks"
                  checked={settings.showSocialLinks}
                  onCheckedChange={(checked) => handleSwitchChange('showSocialLinks', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50">
                <div>
                  <Label htmlFor="maintenanceMode" className="text-sm font-medium">Maintenance Mode</Label>
                  <p className="text-xs text-foreground/70">Put site in maintenance mode</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSwitchChange('maintenanceMode', checked)}
                />
              </div>
            </div>
          </div>

          {/* Custom CSS */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Advanced</h3>
            <div>
              <Label htmlFor="customCss">Custom CSS (Optional)</Label>
              <Textarea
                id="customCss"
                name="customCss"
                value={settings.customCss}
                onChange={handleInputChange}
                rows={6}
                placeholder="Add custom CSS styles..."
                className="bg-background/50 font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-border/50">
            <Button onClick={handleSave} disabled={saving} className="group">
              <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Parallax>
  );
}