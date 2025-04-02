
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { Database, FileText, Layers, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Semester, DockerImage, Document } from '@/types';
import { Input } from '@/components/ui/input';

const StudentHome: React.FC = () => {
  const navigate = useNavigate();
  const { dockerImages, documents } = useApp();
  const [activeTab, setActiveTab] = useState('semesters');
  const [searchTerm, setSearchTerm] = useState('');
  const [docSearchTerm, setDocSearchTerm] = useState('');

  // Filter logic for docker images
  const filteredImages = dockerImages.filter(
    (image) =>
      image.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.semester.includes(searchTerm)
  );

  // Filter logic for documents
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(docSearchTerm.toLowerCase())
  );

  const handleSemesterClick = (semester: Semester) => {
    navigate(`/student/semester/${semester}`);
  };

  const semesters: Semester[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const countImagesBySemester = (semester: Semester) => {
    return dockerImages.filter(img => img.semester === semester).length;
  };

  return (
    <Layout title="Student Portal">
      <Tabs defaultValue="semesters" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="semesters" className="flex items-center">
            <Layers size={16} className="mr-2" /> Semesters
          </TabsTrigger>
          <TabsTrigger value="labs" className="flex items-center">
            <Database size={16} className="mr-2" /> Labs
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center">
            <FileText size={16} className="mr-2" /> Documentation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="semesters">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {semesters.map((semester) => (
              <Card 
                key={semester} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSemesterClick(semester)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-center text-2xl text-docker-primary">
                    Semester {semester}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center h-24">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-docker-secondary">
                        {countImagesBySemester(semester)}
                      </div>
                      <div className="text-sm text-gray-500">Docker Images</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-center">
                  <Button
                    variant="ghost"
                    className="text-docker-secondary hover:text-docker-secondary/90 hover:bg-docker-secondary/10"
                  >
                    Browse Images
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="labs">
          <div className="mb-6">
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
        </TabsContent>

        <TabsContent value="documents">
          <div className="mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by title..."
                value={docSearchTerm}
                onChange={(e) => setDocSearchTerm(e.target.value)}
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
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default StudentHome;
