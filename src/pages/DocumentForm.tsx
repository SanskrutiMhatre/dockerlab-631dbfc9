
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Document, DocumentField } from '@/types';
import { Plus, Trash, Upload } from 'lucide-react';
import { uploadImage } from '@/utils/cloudinary';

const DocumentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, documents, addDocument, updateDocument } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState<DocumentField[]>([]);
  const [loading, setLoading] = useState(false);

  const isEditMode = !!id;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    if (isEditMode) {
      const documentToEdit = documents.find((doc) => doc.id === id);
      if (documentToEdit) {
        setTitle(documentToEdit.title);
        setFields(documentToEdit.fields);
      } else {
        navigate('/admin/documents');
        toast({
          title: 'Error',
          description: 'Document not found',
          variant: 'destructive',
        });
      }
    }
  }, [isAuthenticated, isEditMode, id, documents, navigate, toast]);

  if (!isAuthenticated) {
    return null;
  }

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'heading',
        value: '',
      },
    ]);
  };

  const handleFieldTypeChange = (id: string, type: DocumentField['type']) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, type } : field
      )
    );
  };

  const handleFieldValueChange = (id: string, value: string) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleImageUpload = async (id: string, file: File) => {
    try {
      setLoading(true);
      const imageUrl = await uploadImage(file);
      handleFieldValueChange(id, imageUrl);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    const document: Omit<Document, 'id'> = {
      title,
      fields,
    };
    
    if (isEditMode && id) {
      updateDocument(id, document);
      toast({
        title: 'Success',
        description: 'Document updated successfully',
      });
    } else {
      addDocument(document);
      toast({
        title: 'Success',
        description: 'Document created successfully',
      });
    }
    
    navigate('/admin/documents');
  };

  return (
    <Layout title={isEditMode ? 'Edit Document' : 'Create Document'} adminPortal>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Document' : 'Create Document'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Document Fields</h3>
                <Button
                  type="button"
                  onClick={handleAddField}
                  className="bg-docker-secondary hover:bg-docker-secondary/90 flex items-center"
                >
                  <Plus size={16} className="mr-2" /> Add Field
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-gray-500">No fields added yet</p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleAddField}
                    className="mt-2"
                  >
                    Add your first field
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border rounded-md bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm bg-docker-primary text-white px-2 py-1 rounded">
                            Field {index + 1}
                          </span>
                          <Select
                            value={field.type}
                            onValueChange={(value) =>
                              handleFieldTypeChange(field.id, value as DocumentField['type'])
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Field Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="heading">Heading</SelectItem>
                              <SelectItem value="content">Content</SelectItem>
                              <SelectItem value="command">Command</SelectItem>
                              <SelectItem value="image">Image</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveField(field.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>

                      {field.type === 'heading' && (
                        <Input
                          placeholder="Enter heading"
                          value={field.value}
                          onChange={(e) =>
                            handleFieldValueChange(field.id, e.target.value)
                          }
                        />
                      )}

                      {field.type === 'content' && (
                        <Textarea
                          placeholder="Enter content"
                          value={field.value}
                          onChange={(e) =>
                            handleFieldValueChange(field.id, e.target.value)
                          }
                          rows={3}
                        />
                      )}

                      {field.type === 'command' && (
                        <Textarea
                          placeholder="Enter command"
                          value={field.value}
                          onChange={(e) =>
                            handleFieldValueChange(field.id, e.target.value)
                          }
                          rows={2}
                          className="font-mono"
                        />
                      )}

                      {field.type === 'image' && (
                        <div className="space-y-2">
                          {field.value ? (
                            <div className="space-y-2">
                              <img
                                src={field.value}
                                alt="Document content"
                                className="max-h-48 max-w-full rounded-md mx-auto"
                              />
                              <div className="flex justify-between items-center">
                                <Input 
                                  value={field.value} 
                                  onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                                  placeholder="Image URL"
                                  className="text-xs"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleFieldValueChange(field.id, '')}
                                  className="ml-2"
                                >
                                  Clear
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <Label 
                                htmlFor={`image-upload-${field.id}`}
                                className="cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md hover:bg-gray-100"
                              >
                                <Upload size={24} className="mb-2 text-gray-500" />
                                <span className="text-sm text-gray-500">
                                  {loading ? 'Uploading...' : 'Click to upload image'}
                                </span>
                                <Input
                                  id={`image-upload-${field.id}`}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleImageUpload(field.id, e.target.files[0]);
                                    }
                                  }}
                                  disabled={loading}
                                />
                              </Label>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/documents')}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-docker-secondary hover:bg-docker-secondary/90">
              {isEditMode ? 'Update Document' : 'Create Document'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Layout>
  );
};

export default DocumentForm;
