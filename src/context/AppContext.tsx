
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DockerImage, Document } from '@/types';

// Mock admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'dockerlab@123';

interface AppContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  dockerImages: DockerImage[];
  documents: Document[];
  addDockerImage: (image: Omit<DockerImage, 'id'>) => void;
  updateDockerImage: (id: string, image: Omit<DockerImage, 'id'>) => void;
  deleteDockerImage: (id: string) => void;
  addDocument: (document: Omit<Document, 'id'>) => void;
  updateDocument: (id: string, document: Omit<Document, 'id'>) => void;
  deleteDocument: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dockerImages, setDockerImages] = useState<DockerImage[]>(() => {
    const saved = localStorage.getItem('dockerImages');
    return saved ? JSON.parse(saved) : [];
  });
  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('documents');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dockerImages', JSON.stringify(dockerImages));
  }, [dockerImages]);

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  const login = (username: string, password: string) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addDockerImage = (image: Omit<DockerImage, 'id'>) => {
    const newImage = {
      ...image,
      id: Math.random().toString(36).substr(2, 9),
    };
    setDockerImages([...dockerImages, newImage]);
  };

  const updateDockerImage = (id: string, image: Omit<DockerImage, 'id'>) => {
    setDockerImages(
      dockerImages.map((img) => (img.id === id ? { ...image, id } : img))
    );
  };

  const deleteDockerImage = (id: string) => {
    setDockerImages(dockerImages.filter((img) => img.id !== id));
  };

  const addDocument = (document: Omit<Document, 'id'>) => {
    const newDocument = {
      ...document,
      id: Math.random().toString(36).substr(2, 9),
    };
    setDocuments([...documents, newDocument]);
  };

  const updateDocument = (id: string, document: Omit<Document, 'id'>) => {
    setDocuments(
      documents.map((doc) => (doc.id === id ? { ...document, id } : doc))
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        dockerImages,
        documents,
        addDockerImage,
        updateDockerImage,
        deleteDockerImage,
        addDocument,
        updateDocument,
        deleteDocument,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
