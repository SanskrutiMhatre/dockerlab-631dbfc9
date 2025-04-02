
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { DockerImage, Semester } from '@/types';

const DockerImageForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, dockerImages, addDockerImage, updateDockerImage } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Omit<DockerImage, 'id'>>({
    semester: '1',
    subject: '',
    pullCommand: '',
    runCommand: '',
    instructions: '',
    notes: '',
  });

  const isEditMode = !!id;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    if (isEditMode) {
      const imageToEdit = dockerImages.find((img) => img.id === id);
      if (imageToEdit) {
        setFormData({
          semester: imageToEdit.semester,
          subject: imageToEdit.subject,
          pullCommand: imageToEdit.pullCommand,
          runCommand: imageToEdit.runCommand,
          instructions: imageToEdit.instructions,
          notes: imageToEdit.notes,
        });
      } else {
        navigate('/admin/docker-images');
        toast({
          title: 'Error',
          description: 'Docker image not found',
          variant: 'destructive',
        });
      }
    }
  }, [isAuthenticated, isEditMode, id, dockerImages, navigate, toast]);

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, semester: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && id) {
      updateDockerImage(id, formData);
      toast({
        title: 'Success',
        description: 'Docker image updated successfully',
      });
    } else {
      addDockerImage(formData);
      toast({
        title: 'Success',
        description: 'Docker image added successfully',
      });
    }
    
    navigate('/admin/docker-images');
  };

  return (
    <Layout title={isEditMode ? 'Edit Docker Image' : 'Add Docker Image'} adminPortal>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Docker Image' : 'Add Docker Image'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={formData.semester}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => (i + 1).toString()).map(
                    (sem) => (
                      <SelectItem key={sem} value={sem}>
                        Semester {sem}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject Name</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pullCommand">Pull Command</Label>
              <Input
                id="pullCommand"
                name="pullCommand"
                value={formData.pullCommand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="runCommand">Run Command</Label>
              <Input
                id="runCommand"
                name="runCommand"
                value={formData.runCommand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/docker-images')}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-docker-secondary hover:bg-docker-secondary/90">
              {isEditMode ? 'Update Docker Image' : 'Add Docker Image'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Layout>
  );
};

export default DockerImageForm;
