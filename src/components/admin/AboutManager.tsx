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

interface AboutData {
  bio: string;
  skills: string[];
  education: string;
}

export function AboutManager() {
  const [aboutData, setAboutData] = useState<AboutData>({
    bio: '',
    skills: [],
    education: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const docRef = doc(db, 'about', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as AboutData;
        setAboutData(data);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      toast.error('Failed to fetch about data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAboutData({
      ...aboutData,
      [name]: value,
    });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setAboutData({
      ...aboutData,
      skills,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await setDoc(doc(db, 'about', 'main'), aboutData);
      toast.success('About information updated successfully');
    } catch (error) {
      console.error('Error saving about data:', error);
      toast.error('Failed to save about information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading about information...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">About Information</h2>

      <Card>
        <CardHeader>
          <CardTitle>Edit About Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                name="bio"
                value={aboutData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell visitors about yourself..."
                required
              />
            </div>

            <div>
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={aboutData.skills.join(', ')}
                onChange={handleSkillsChange}
                placeholder="React, Next.js, TypeScript, Node.js"
              />
            </div>

            <div>
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                name="education"
                value={aboutData.education}
                onChange={handleInputChange}
                rows={2}
                placeholder="Your educational background..."
                required
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}