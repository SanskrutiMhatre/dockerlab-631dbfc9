
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { ArrowLeft, Copy, Edit } from 'lucide-react';
import { Document } from '@/types';
import CopyCommand from '@/components/CopyCommand';

interface DocumentViewProps {
  adminView?: boolean;
}

const DocumentView: React.FC<DocumentViewProps> = ({ adminView = false }) => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, documents } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    if (adminView && !isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    if (id) {
      const foundDocument = documents.find((doc) => doc.id === id);
      if (foundDocument) {
        setDocument(foundDocument);
      } else {
        toast({
          title: 'Error',
          description: 'Document not found',
          variant: 'destructive',
        });
        navigate(adminView ? '/admin/documents' : '/student/documents');
      }
    }
  }, [id, documents, navigate, toast, isAuthenticated, adminView]);

  if (adminView && !isAuthenticated) {
    return null;
  }

  if (!document) {
    return (
      <Layout title="Loading..." adminPortal={adminView}>
        <div className="text-center py-8">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title={document.title} adminPortal={adminView}>
      <div className="mb-6 flex justify-between items-center">
        <Button
          variant="outline"
          className="flex items-center"
          onClick={() => navigate(adminView ? '/admin/documents' : '/student/documents')}
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Documents
        </Button>
        {adminView && (
          <Button
            className="bg-docker-secondary hover:bg-docker-secondary/90 flex items-center"
            onClick={() => navigate(`/admin/documents/edit/${document.id}`)}
          >
            <Edit size={16} className="mr-2" /> Edit Document
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{document.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {document.fields.map((field, index) => (
            <div key={field.id} className="document-field">
              {field.type === 'heading' && (
                <h2 className="text-xl font-bold mt-6 mb-3 text-docker-primary border-b pb-2">
                  {field.value}
                </h2>
              )}

              {field.type === 'content' && (
                <div className="prose max-w-none">
                  {field.value.split('\n').map((line, i) => (
                    <p key={i} className="mb-3">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {field.type === 'command' && (
                <CopyCommand command={field.value} className="my-4" />
              )}

              {field.type === 'image' && field.value && (
                <div className="my-4">
                  <img
                    src={field.value}
                    alt="Document content"
                    className="max-w-full rounded-md mx-auto"
                  />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default DocumentView;
