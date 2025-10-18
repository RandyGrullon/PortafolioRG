'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsCollection = collection(db, 'projects');
        const projectsSnapshot = await getDocs(projectsCollection);
        const projectsList = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        setProjects(projectsList);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <ParallaxProvider>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-6 lg:px-12 py-24">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              All Projects
            </div>
            <h1 className="font-headline text-4xl lg:text-6xl font-bold mb-6">
              My Complete Portfolio
            </h1>
            <p className="text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed mb-8">
              A comprehensive showcase of my work and the technologies I've used to bring ideas to life.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Projects Grid */}
          {projectsLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
              {projects.map((project, index) => (
                <Parallax
                  key={project.id}
                  translateY={[10 + index * 2, -10 - index * 2]}
                  className="group w-full max-w-sm"
                >
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 transform group-hover:scale-[1.02] group-hover:-translate-y-1">
                    <CardHeader className="p-0">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <div className="flex gap-2">
                            {project.githubUrl && (
                              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  GitHub
                                </Link>
                              </Button>
                            )}
                            {project.liveUrl && (
                              <Button size="sm" className="h-8 w-8 p-0">
                                <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                  Live
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="mb-4 leading-relaxed">
                        {project.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Parallax>
              ))}
            </div>
          )}
        </div>
      </main>
    </ParallaxProvider>
  );
}