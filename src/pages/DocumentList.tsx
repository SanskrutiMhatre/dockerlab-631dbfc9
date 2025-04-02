
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Edit, FileText, Plus, Trash } from 'lucide-react';
import { Document } from '@/types';

const DocumentList: React.FC = () => {
  const { isAuthenticated, documents, deleteDocument } = useApp();
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

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
    }
  };

  return (
    <Layout title="Manage Documents" adminPortal>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button
          onClick={() => navigate('/admin/documents/add')}
          className="bg-docker-secondary hover:bg-docker-secondary/90 flex items-center"
        >
          <Plus size={16} className="mr-2" /> Create Document
        </Button>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No documents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc: Document) => (
            <Card key={doc.id} className="overflow-hidden">
              <CardHeader className="bg-docker-primary/5 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <FileText size={20} className="mr-2 text-docker-secondary" />
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/documents/edit/${doc.id}`)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-sm text-gray-600">
                  {doc.fields.length} fields
                </div>
                <Button
                  variant="link"
                  className="p-0 h-auto text-docker-secondary"
                  onClick={() => navigate(`/admin/documents/view/${doc.id}`)}
                >
                  View Document
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default DocumentList;
