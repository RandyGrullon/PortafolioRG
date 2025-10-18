'use client';

import { useEffect, useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    fetchProjects();
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      console.log('Checking Firebase connection...');
      const testQuery = await getDocs(collection(db, 'projects'));
      console.log('Firebase connection successful, found', testQuery.docs.length, 'projects');
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Firebase connection error:', error);
      setConnectionStatus('error');

      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please check Firestore security rules.');
      } else if (error.code === 'unavailable') {
        toast.error('Firebase service unavailable. Please check your internet connection.');
      } else {
        toast.error(`Connection failed: ${error.message}`);
      }
    }
  };

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          technologies: data.technologies || [],
          githubUrl: data.githubUrl || null,
          liveUrl: data.liveUrl || null,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        };
      }) as Project[];
      setProjects(projectsData);
      console.log('Projects loaded from Firebase:', projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

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

    setLoading(true);
    try {
      const compressedBase64 = await compressImage(file);
      setFormData(prev => ({ ...prev, imageUrl: compressedBase64 }));
      setImageFile(null); // No longer need the file since we have base64
      toast.success('La imagen ha sido comprimida y está lista para guardar.');
    } catch (error) {
      console.error('Error compressing image:', error);
      toast.error('Error al procesar la imagen. Intenta con otra imagen.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.technologies.trim()) {
      toast.error('Technologies are required');
      return;
    }
    if (!formData.imageUrl.trim()) {
      toast.error('Please provide an image (upload file or enter URL)');
      return;
    }

    // Validate URL format if provided (but allow base64 data URLs)
    if (formData.imageUrl.trim() && !isValidUrl(formData.imageUrl.trim()) && !formData.imageUrl.trim().startsWith('data:image/')) {
      toast.error('Please provide a valid image URL or upload an image file');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Starting project creation...');
      const imageUrl = formData.imageUrl.trim();

      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: imageUrl,
        technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech),
        githubUrl: formData.githubUrl.trim() || null,
        liveUrl: formData.liveUrl.trim() || null,
        createdAt: new Date(),
      };

      console.log('Project data to save:', projectData);

      if (editingProject) {
        console.log('Updating existing project...');
        await updateDoc(doc(db, 'projects', editingProject.id), projectData);
        toast.success(`Project "${projectData.title}" updated successfully`);
      } else {
        console.log('Creating new project...');
        const docRef = await addDoc(collection(db, 'projects'), projectData);
        console.log('Project created with ID:', docRef.id);
        toast.success(`Project "${projectData.title}" added successfully`);
      }

      // Reset form
      setIsDialogOpen(false);
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
      });

      // Refresh projects list
      console.log('Refreshing projects list...');
      await fetchProjects();
    } catch (error: any) {
      console.error('Error saving project:', error);

      let errorMessage = 'Failed to save project';
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your authentication and Firestore rules.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Service unavailable. Please check your internet connection.';
      } else if (error.code === 'invalid-argument') {
        errorMessage = 'Invalid data provided. Please check all fields.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      technologies: project.technologies.join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (project: Project) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteDoc(doc(db, 'projects', project.id));
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  if (loading && projects.length === 0) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Projects</h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm text-foreground/60">
              {connectionStatus === 'connected' ? 'Connected' :
               connectionStatus === 'error' ? 'Connection Error' : 'Checking...'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingProject(null);
                setFormData({
                  title: '',
                  description: '',
                  imageUrl: '',
                  technologies: '',
                  githubUrl: '',
                  liveUrl: '',
                });
                setIsDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-foreground/60 mt-1">
                    Upload an image file, or provide a URL below:
                  </p>
                  <Input
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    💡 Tip: If file upload fails due to CORS, use a direct image URL instead
                  </p>
                  {formData.imageUrl && (
                    <div className="mt-4">
                      <Label>Image Preview</Label>
                      <div className="mt-2 border border-border rounded-lg p-4 bg-muted/50">
                        <img
                          src={formData.imageUrl}
                          alt="Project preview"
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            toast.error('Failed to load image preview');
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                  <Input
                    id="technologies"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleInputChange}
                    placeholder="React, Next.js, TypeScript"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/repo"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="liveUrl">Live URL</Label>
                  <Input
                    id="liveUrl"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (editingProject ? 'Update' : 'Add')} Project
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              {project.imageUrl && (
                <div className="mb-4">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <CardTitle className="text-lg">{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(project)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 text-foreground/60">
          No projects yet. Add your first project!
        </div>
      )}
    </div>
  );
}