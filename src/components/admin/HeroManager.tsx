'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Parallax } from 'react-scroll-parallax';
import { User, Save, Eye, Upload } from 'lucide-react';
import Image from 'next/image';

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
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();

      img.onload = () => {
        // Calculate new dimensions (max 800px width/height, maintain aspect ratio)
        let { width, height } = img;
        const maxSize = 800;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedBase64);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande. Máximo 10MB.');
      return;
    }

    setSaving(true);
    try {
      const compressedBase64 = await compressImage(file);
      setHeroData(prev => ({ ...prev, profileImageUrl: compressedBase64 }));
      setImageFile(null); // No longer need the file since we have base64
      toast.success('La imagen ha sido comprimida y está lista para guardar.');
    } catch (error) {
      console.error('Error compressing image:', error);
      toast.error('Error al procesar la imagen. Intenta con otra imagen.');
    } finally {
      setSaving(false);
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
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Profile Image Preview */}
              {heroData.profileImageUrl && (
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                    <Image
                      src={heroData.profileImageUrl}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              {/* Text Content */}
              <div className="flex-1 space-y-2">
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
                <Label htmlFor="profileImage">Profile Image</Label>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={saving}
                  className="bg-background/50"
                />
                <p className="text-sm text-foreground/60 mt-1">
                  Upload an image file (max 10MB), or provide a URL below:
                </p>
                <Input
                  id="profileImageUrl"
                  name="profileImageUrl"
                  value={heroData.profileImageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  disabled={saving}
                  className="bg-background/50 mt-2"
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