
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Database, FileText } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, dockerImages, documents } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout title="Admin Dashboard" adminPortal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2" /> Docker Images
            </CardTitle>
            <CardDescription>
              Manage Docker images for lab environments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Total Docker Images: {dockerImages.length}</p>
              <div className="flex flex-col space-y-2">
                <Button onClick={() => navigate('/admin/docker-images')} className="bg-docker-secondary hover:bg-docker-secondary/90">
                  Manage Docker Images
                </Button>
                <Button onClick={() => navigate('/admin/docker-images/add')} variant="outline">
                  Add New Docker Image
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2" /> Documentation
            </CardTitle>
            <CardDescription>
              Manage instructional documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Total Documents: {documents.length}</p>
              <div className="flex flex-col space-y-2">
                <Button onClick={() => navigate('/admin/documents')} className="bg-docker-secondary hover:bg-docker-secondary/90">
                  Manage Documents
                </Button>
                <Button onClick={() => navigate('/admin/documents/add')} variant="outline">
                  Create New Document
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
