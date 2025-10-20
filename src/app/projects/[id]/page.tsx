'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDoc = doc(db, 'projects', id);
        const projectSnapshot = await getDoc(projectDoc);
        if (projectSnapshot.exists()) {
          setProject({
            id: projectSnapshot.id,
            ...projectSnapshot.data()
          } as Project);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-foreground/70 mb-8">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 lg:px-12 py-24">
        {/* Header */}
        <div className="mb-12">
          <Button asChild variant="outline" size="lg" className="mb-8">
            <Link href="/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            Project Details
          </div>
          <h1 className="font-headline text-4xl lg:text-6xl font-bold mb-6">
            {project.title}
          </h1>
          <p className="text-lg lg:text-xl text-foreground/70 max-w-3xl leading-relaxed mb-8">
            {project.description}
          </p>
          {project.detailedDescription && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Project Details</h2>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                {project.detailedDescription}
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-4 mb-8">
            {project.githubUrl && (
              <Button asChild size="lg">
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </Link>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild variant="outline" size="lg">
                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live Demo
                </Link>
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm bg-primary/10 text-primary border-primary/20"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project Image */}
        <div className="mb-16">
          <Card className="overflow-hidden">
            <div className="relative h-96 lg:h-[600px]">
              {project.images && project.images.length > 0 && (
                <Image
                  src={project.images[0]}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </Card>
        </div>

        {/* Gallery Images */}
        {project.images && project.images.length > 1 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.slice(1).map((imageUrl, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative h-48">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={`${project.title} - Image ${index + 2}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Additional Content Placeholder */}
        <div className="text-center text-foreground/50">
          <p>More detailed content and additional images can be added here.</p>
        </div>
      </div>
    </main>
  );
}