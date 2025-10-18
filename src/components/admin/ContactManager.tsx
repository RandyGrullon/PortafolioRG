'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Parallax } from 'react-scroll-parallax';
import { Mail, Phone, MapPin, Save, Eye } from 'lucide-react';

interface ContactData {
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

export function ContactManager() {
  const [contactData, setContactData] = useState<ContactData>({
    email: '',
    phone: '',
    location: '',
    whatsappNumber: '',
    contactTitle: '',
    contactSubtitle: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      instagram: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const docRef = doc(db, 'content', 'contact');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Handle migration from old structure
        const migratedData: ContactData = {
          email: data.email || 'randy.grullon@example.com',
          phone: data.phone || '+1 (555) 123-4567',
          location: data.location || 'Santo Domingo, Dominican Republic',
          whatsappNumber: data.whatsappNumber || '+18091234567',
          contactTitle: data.contactTitle || "Let's Connect",
          contactSubtitle: data.contactSubtitle || 'Get In Touch',
          socialLinks: data.socialLinks || {
            linkedin: data.linkedinUrl || '',
            github: data.githubUrl || '',
            twitter: data.twitterUrl || '',
            instagram: data.instagramUrl || '',
          },
        };
        
        setContactData(migratedData);
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
      toast.error('Failed to fetch contact data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1];
      setContactData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setContactData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', 'contact'), contactData);
      toast.success('Contact information updated successfully!');
    } catch (error) {
      console.error('Error saving contact data:', error);
      toast.error('Failed to save contact data');
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
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            Contact Information Management
          </CardTitle>
          <p className="text-foreground/70">Manage your contact details and social links</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Preview */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-background/50 to-background/30 border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Contact Preview</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-accent/5">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-sm text-foreground/80">{contactData.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-primary/5">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Phone</p>
                  <p className="text-sm text-foreground/80">{contactData.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-accent/5">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Location</p>
                  <p className="text-sm text-foreground/80">{contactData.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="contactTitle">Contact Section Title</Label>
                <Input
                  id="contactTitle"
                  name="contactTitle"
                  value={contactData.contactTitle}
                  onChange={handleInputChange}
                  placeholder="Let's Connect"
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="contactSubtitle">Contact Section Subtitle</Label>
                <Input
                  id="contactSubtitle"
                  name="contactSubtitle"
                  value={contactData.contactSubtitle}
                  onChange={handleInputChange}
                  placeholder="Get In Touch"
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={contactData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={contactData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={contactData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={contactData.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="socialLinks.linkedin">LinkedIn URL</Label>
                <Input
                  id="socialLinks.linkedin"
                  name="socialLinks.linkedin"
                  value={contactData.socialLinks?.linkedin || ''}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="socialLinks.github">GitHub URL</Label>
                <Input
                  id="socialLinks.github"
                  name="socialLinks.github"
                  value={contactData.socialLinks?.github || ''}
                  onChange={handleInputChange}
                  placeholder="https://github.com/yourusername"
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="socialLinks.twitter">Twitter URL</Label>
                <Input
                  id="socialLinks.twitter"
                  name="socialLinks.twitter"
                  value={contactData.socialLinks?.twitter || ''}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/yourusername"
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="socialLinks.instagram">Instagram URL</Label>
                <Input
                  id="socialLinks.instagram"
                  name="socialLinks.instagram"
                  value={contactData.socialLinks?.instagram || ''}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/yourusername"
                  className="bg-background/50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-border/50">
            <Button onClick={handleSave} disabled={saving} className="group">
              <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Parallax>
  );
}