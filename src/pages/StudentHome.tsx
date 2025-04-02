
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { Database, FileText, Layers } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Semester } from '@/types';

const StudentHome: React.FC = () => {
  const navigate = useNavigate();
  const { dockerImages } = useApp();
  const [activeTab, setActiveTab] = useState('semesters');

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
          <Card>
            <CardHeader>
              <CardTitle>Labs</CardTitle>
              <CardDescription>
                Browse all available Docker images for lab environments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/student/labs')}
                className="bg-docker-secondary hover:bg-docker-secondary/90"
              >
                View All Lab Images
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Access instructional documentation and guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/student/documents')}
                className="bg-docker-secondary hover:bg-docker-secondary/90"
              >
                Browse Documentation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default StudentHome;
