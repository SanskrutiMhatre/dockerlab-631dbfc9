
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { ArrowLeft, Database } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DockerImage, Semester } from '@/types';

const SemesterView: React.FC = () => {
  const { semester } = useParams<{ semester: Semester }>();
  const navigate = useNavigate();
  const { dockerImages } = useApp();
  const [semesterImages, setSemesterImages] = useState<DockerImage[]>([]);

  useEffect(() => {
    if (semester) {
      const filtered = dockerImages.filter(img => img.semester === semester);
      setSemesterImages(filtered);
    }
  }, [semester, dockerImages]);

  return (
    <Layout title={`Semester ${semester} - Subjects`}>
      <div className="mb-6">
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => navigate('/student')}
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Semesters
        </Button>
      </div>

      {semesterImages.length === 0 ? (
        <div className="text-center py-12">
          <Database size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">No Docker Images Available</h3>
          <p className="text-gray-400">There are no Docker images for this semester yet.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/student')}
          >
            Go back to Student Portal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {semesterImages.map((image) => (
            <Card 
              key={image.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/student/image/${image.id}`)}
            >
              <CardHeader className="pb-2 bg-docker-primary/5">
                <CardTitle className="text-xl">{image.subject}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-sm text-gray-600 mb-2 line-clamp-3">
                  {image.instructions || "No instructions provided."}
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-end">
                <Button
                  variant="ghost"
                  className="text-docker-secondary hover:text-docker-secondary/90"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default SemesterView;
