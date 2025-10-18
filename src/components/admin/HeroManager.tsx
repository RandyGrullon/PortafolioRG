'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Parallax } from 'react-scroll-parallax';
import { User, Save, Eye } from 'lucide-react';

interface HeroData {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
  projectsCount: string;
  profileImageUrl: string;
}

export function HeroManager() {
  const [heroData, setHeroData] = useState<HeroData>({
    name: '',
    title: '',
    subtitle: '',
    description: '',
    status: '',
    projectsCount: '',
    profileImageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const docRef = doc(db, 'content', 'hero');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as HeroData;
        setHeroData(data);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      toast.error('Failed to fetch hero data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHeroData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', 'hero'), heroData);
      toast.success('Hero section updated successfully!');
    } catch (error) {
      console.error('Error saving hero data:', error);
      toast.error('Failed to save hero data');
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
              <User className="w-5 h-5 text-primary" />
            </div>
            Hero Section Management
          </CardTitle>
          <p className="text-foreground/70">Customize your hero section content and appearance</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Preview */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-background/50 to-background/30 border border-border/50">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Live Preview</span>
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                {heroData.status}
              </div>
              <h2 className="text-2xl font-bold">
                {heroData.subtitle} <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{heroData.name}</span>
              </h2>
              <p className="text-lg text-primary font-medium">{heroData.title}</p>
              <p className="text-foreground/70">{heroData.description}</p>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="subtitle">Greeting Text</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={heroData.subtitle}
                  onChange={handleInputChange}
                  placeholder="Hi, I'm"
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={heroData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="title">Your Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={heroData.title}
                  onChange={handleInputChange}
                  placeholder="Fullstack Developer"
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="status">Status Badge</Label>
                <Input
                  id="status"
                  name="status"
                  value={heroData.status}
                  onChange={handleInputChange}
                  placeholder="Available for new projects"
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={heroData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe yourself and your services..."
                  className="bg-background/50 resize-none"
                />
              </div>

              <div>
                <Label htmlFor="projectsCount">Projects Count</Label>
                <Input
                  id="projectsCount"
                  name="projectsCount"
                  value={heroData.projectsCount}
                  onChange={handleInputChange}
                  placeholder="50+"
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="profileImageUrl">Profile Image URL (Optional)</Label>
                <Input
                  id="profileImageUrl"
                  name="profileImageUrl"
                  value={heroData.profileImageUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
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