
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Edit, Plus, Trash } from 'lucide-react';
import { DockerImage } from '@/types';

const DockerImageList: React.FC = () => {
  const { isAuthenticated, dockerImages, deleteDockerImage } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const filteredImages = dockerImages.filter(
    (image) =>
      image.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.semester.includes(searchTerm)
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this Docker image?')) {
      deleteDockerImage(id);
    }
  };

  return (
    <Layout title="Manage Docker Images" adminPortal>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          placeholder="Search by subject or semester..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button 
          onClick={() => navigate('/admin/docker-images/add')}
          className="bg-docker-secondary hover:bg-docker-secondary/90 flex items-center"
        >
          <Plus size={16} className="mr-2" /> Add Docker Image
        </Button>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No Docker images found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredImages.map((image: DockerImage) => (
            <Card key={image.id} className="overflow-hidden">
              <CardHeader className="bg-docker-primary/5 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-docker-secondary text-white text-xs px-2 py-1 rounded-md mb-2 inline-block">
                      Semester {image.semester}
                    </span>
                    <CardTitle>{image.subject}</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/docker-images/edit/${image.id}`)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div>
                    <h4 className="font-semibold text-sm">Pull Command:</h4>
                    <code className="bg-gray-100 p-2 rounded block text-sm overflow-x-auto">
                      {image.pullCommand}
                    </code>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Run Command:</h4>
                    <code className="bg-gray-100 p-2 rounded block text-sm overflow-x-auto">
                      {image.runCommand}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default DockerImageList;
