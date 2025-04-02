
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { ArrowLeft, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DockerImage } from '@/types';

const LabsList: React.FC = () => {
  const navigate = useNavigate();
  const { dockerImages } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredImages = dockerImages.filter(
    (image) =>
      image.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.semester.includes(searchTerm)
  );

  return (
    <Layout title="Labs - Docker Images">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => navigate('/student')}
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Student Portal
        </Button>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by subject or semester..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No Docker images found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredImages.map((image: DockerImage) => (
            <Card 
              key={image.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/student/image/${image.id}`)}
            >
              <CardHeader className="bg-docker-primary/5 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-docker-secondary text-white text-xs px-2 py-1 rounded-md mb-2 inline-block">
                      Semester {image.semester}
                    </span>
                    <CardTitle>{image.subject}</CardTitle>
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
                  <Button
                    variant="ghost"
                    className="text-docker-secondary hover:text-docker-secondary/90 p-0 h-auto mt-2"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default LabsList;
