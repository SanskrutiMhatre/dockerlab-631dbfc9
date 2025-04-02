
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DockerImage } from '@/types';
import CopyCommand from '@/components/CopyCommand';

const ImageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dockerImages } = useApp();
  const [image, setImage] = useState<DockerImage | null>(null);

  useEffect(() => {
    if (id) {
      const foundImage = dockerImages.find(img => img.id === id);
      if (foundImage) {
        setImage(foundImage);
      } else {
        navigate('/student');
      }
    }
  }, [id, dockerImages, navigate]);

  if (!image) {
    return (
      <Layout title="Loading...">
        <div className="text-center py-8">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title={image.subject}>
      <div className="mb-6">
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => navigate(`/student/semester/${image.semester}`)}
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Semester {image.semester}
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-docker-primary/5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <span className="bg-docker-secondary text-white text-xs px-2 py-1 rounded-md mb-2 inline-block">
                Semester {image.semester}
              </span>
              <CardTitle className="text-2xl">{image.subject}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Pull Command</h3>
            <CopyCommand command={image.pullCommand} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Run Command</h3>
            <CopyCommand command={image.runCommand} />
          </div>

          {image.instructions && (
            <div>
              <h3 className="text-lg font-medium mb-2">Instructions</h3>
              <div className="bg-gray-50 rounded-md p-4">
                {image.instructions.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {image.notes && (
            <div>
              <h3 className="text-lg font-medium mb-2">Additional Notes</h3>
              <div className="bg-gray-50 rounded-md p-4">
                {image.notes.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ImageDetails;
