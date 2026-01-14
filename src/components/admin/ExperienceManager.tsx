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
import { ExperienceData, ExperiencePosition } from '@/lib/types';

type LegacyExperienceData = Partial<
  ExperienceData & {
    currentPosition: string;
    currentCompany: string;
    startDate: string;
    endDate: string;
    previousExperience: ExperiencePosition[];
  }
>;

const createEmptyPosition = (): ExperiencePosition => ({
  position: '',
  company: '',
  startDate: '',
  endDate: '',
  description: '',
});

const normalizeExperienceData = (data?: LegacyExperienceData): ExperienceData => {
  const positionsFromNew = Array.isArray(data?.positions) ? data?.positions : [];

  let positions: ExperiencePosition[] = positionsFromNew?.length ? positionsFromNew : [];

  if (!positions.length && data) {
    const legacyPositions: ExperiencePosition[] = [];

    if (
      data.currentPosition ||
      data.currentCompany ||
      data.startDate ||
      data.endDate
    ) {
      legacyPositions.push({
        position: data.currentPosition || '',
        company: data.currentCompany || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        description: '',
      });
    }

    if (Array.isArray(data.previousExperience)) {
      legacyPositions.push(
        ...data.previousExperience.map(exp => ({
          position: exp.position || '',
          company: exp.company || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || '',
        }))
      );
    }

    positions = legacyPositions;
  }

  if (!positions.length) {
    positions = [createEmptyPosition()];
  }

  return {
    professionalSummary: data?.professionalSummary || '',
    technologies: data?.technologies || [],
    positions,
    yearsOfExperience: data?.yearsOfExperience,
  };
};

export function ExperienceManager() {
  const [experienceData, setExperienceData] = useState<ExperienceData>(
    normalizeExperienceData()
  );
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
        const data = docSnap.data() as LegacyExperienceData;
        setExperienceData(normalizeExperienceData(data));
      } else {
        setExperienceData(normalizeExperienceData());
      }
    } catch (error) {
      console.error('Error fetching experience data:', error);
      toast.error('Failed to fetch experience data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate years of experience when positions change
  useEffect(() => {
    const calculatedYears = calculateYearsOfExperience(experienceData.positions);

    setExperienceData(prev => ({
      ...prev,
      yearsOfExperience: calculatedYears,
    }));
  }, [experienceData.positions]);

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

  const addPosition = () => {
    setExperienceData(prev => ({
      ...prev,
      positions: [...prev.positions, createEmptyPosition()],
    }));
  };

  const updatePosition = (
    index: number,
    field: keyof ExperiencePosition,
    value: string
  ) => {
    setExperienceData(prev => ({
      ...prev,
      positions: prev.positions.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removePosition = (index: number) => {
    setExperienceData(prev => {
      const updated = prev.positions.filter((_, i) => i !== index);

      return {
        ...prev,
        positions: updated.length ? updated : [createEmptyPosition()],
      };
    });
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
          {experienceData.yearsOfExperience && (
            <p className="text-sm text-muted-foreground">
              Total experience: {experienceData.yearsOfExperience}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Positions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Positions</Label>
                <Button type="button" variant="outline" onClick={addPosition}>
                  Add Position
                </Button>
              </div>

              {experienceData.positions.map((exp, index) => (
                <Card key={`${exp.position}-${index}`} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={e => updatePosition(index, 'position', e.target.value)}
                        placeholder="Position title"
                        required
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={e => updatePosition(index, 'company', e.target.value)}
                        placeholder="Company name"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={exp.startDate}
                        onChange={e => updatePosition(index, 'startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>End Date (leave empty if current)</Label>
                      <Input
                        type="date"
                        value={exp.endDate}
                        onChange={e => updatePosition(index, 'endDate', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label>Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={e => updatePosition(index, 'description', e.target.value)}
                      rows={3}
                      placeholder="Describe your role and achievements..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removePosition(index)}
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