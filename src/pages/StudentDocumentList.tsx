
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { ArrowLeft, FileText, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Document } from '@/types';

const StudentDocumentList: React.FC = () => {
  const navigate = useNavigate();
  const { documents } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Documentation">
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
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No documents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc: Document) => (
            <Card 
              key={doc.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/student/document/${doc.id}`)}
            >
              <CardHeader className="bg-docker-primary/5 pb-2">
                <div className="flex items-center">
                  <FileText size={20} className="mr-2 text-docker-secondary" />
                  <CardTitle className="text-lg">{doc.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-sm text-gray-600">
                  {doc.fields.length} fields
                </div>
                <Button
                  variant="link"
                  className="p-0 h-auto text-docker-secondary"
                >
                  Read Document
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default StudentDocumentList;
