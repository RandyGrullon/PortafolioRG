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
import { calculateYearsOfExperience } from '@/lib/utils';

interface ExperienceData {
  currentPosition: string;
  currentCompany: string;
  startDate: string;
  endDate: string;
  professionalSummary: string;
  technologies: string[];
  previousExperience: {
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
}

export function ExperienceManager() {
  const [experienceData, setExperienceData] = useState<ExperienceData>({
    currentPosition: '',
    currentCompany: '',
    startDate: '',
    endDate: '',
    professionalSummary: '',
    technologies: [],
    previousExperience: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExperienceData();
  }, []);

  const fetchExperienceData = async () => {
    try {
      const docRef = doc(db, 'experience', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as ExperienceData;
        setExperienceData(data);
      } else {
        setExperienceData({
          currentPosition: '',
          currentCompany: '',
          startDate: '',
          endDate: '',
          professionalSummary: '',
          technologies: [],
          previousExperience: [],
        });
      }
    } catch (error) {
      console.error('Error fetching experience data:', error);
      toast.error('Failed to fetch experience data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate years of experience when dates change
  useEffect(() => {
    if (experienceData.startDate) {
      const calculatedYears = calculateYearsOfExperience(
        experienceData.startDate,
        experienceData.endDate,
        experienceData.previousExperience
      );
      setExperienceData(prev => ({
        ...prev,
        yearsOfExperience: calculatedYears
      }));
    }
  }, [experienceData.startDate, experienceData.endDate, experienceData.previousExperience]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExperienceData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const technologies = e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech);
    setExperienceData(prev => ({
      ...prev,
      technologies,
    }));
  };

  const addPreviousExperience = () => {
    setExperienceData(prev => ({
      ...prev,
      previousExperience: [
        ...prev.previousExperience,
        { position: '', company: '', startDate: '', endDate: '', description: '' }
      ],
    }));
  };

  const updatePreviousExperience = (index: number, field: keyof ExperienceData['previousExperience'][0], value: string) => {
    setExperienceData(prev => ({
      ...prev,
      previousExperience: prev.previousExperience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removePreviousExperience = (index: number) => {
    setExperienceData(prev => ({
      ...prev,
      previousExperience: prev.previousExperience.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await setDoc(doc(db, 'experience', 'main'), experienceData);
      toast.success('Experience information updated successfully');
    } catch (error) {
      console.error('Error saving experience data:', error);
      toast.error('Failed to save experience information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading experience information...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Experience Information</h2>

      <Card>
        <CardHeader>
          <CardTitle>Edit Experience Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentPosition">Current Position</Label>
                <Input
                  id="currentPosition"
                  name="currentPosition"
                  value={experienceData.currentPosition}
                  onChange={handleInputChange}
                  placeholder="e.g. Fullstack Developer"
                  required
                />
              </div>
              <div>
                <Label htmlFor="currentCompany">Current Company</Label>
                <Input
                  id="currentCompany"
                  name="currentCompany"
                  value={experienceData.currentCompany}
                  onChange={handleInputChange}
                  placeholder="e.g. Tech Company Inc."
                  required
                />
              </div>
            </div>

            {/* Start and End Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={experienceData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date (leave empty if current)</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={experienceData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Professional Summary */}
            <div>
              <Label htmlFor="professionalSummary">Professional Summary</Label>
              <Textarea
                id="professionalSummary"
                name="professionalSummary"
                value={experienceData.professionalSummary}
                onChange={handleInputChange}
                rows={4}
                placeholder="Brief overview of your professional background and expertise..."
                required
              />
            </div>

            {/* Technologies */}
            <div>
              <Label htmlFor="technologies">Technologies & Tools (comma-separated)</Label>
              <Input
                id="technologies"
                value={experienceData.technologies.join(', ')}
                onChange={handleTechnologiesChange}
                placeholder="React, Next.js, TypeScript, Node.js, Firebase, AWS"
              />
            </div>

            {/* Previous Experience */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Previous Experience</Label>
                <Button type="button" variant="outline" onClick={addPreviousExperience}>
                  Add Experience
                </Button>
              </div>

              {experienceData.previousExperience.map((exp, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updatePreviousExperience(index, 'position', e.target.value)}
                        placeholder="Position title"
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updatePreviousExperience(index, 'company', e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => updatePreviousExperience(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => updatePreviousExperience(index, 'endDate', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label>Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updatePreviousExperience(index, 'description', e.target.value)}
                      rows={3}
                      placeholder="Describe your role and achievements..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removePreviousExperience(index)}
                  >
                    Remove
                  </Button>
                </Card>
              ))}
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