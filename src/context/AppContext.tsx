
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DockerImage, Document } from '@/types';

const url = import.meta.env.VITE_API_BACKEND_URL;
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
  const [dockerImages,setDockerImages]=useState([]);
 
  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('documents');
    return saved ? JSON.parse(saved) : [];
  });


  useEffect(() => {
    fetch(`${url}docker`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log("Success:", data.data);
          setDockerImages(data.data); // Update state
        } else {
          console.log("Failed to fetch data");
        }
      })
      .catch(err => {
        console.log("Error fetching data:");
      });
  }, []);

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

  const addDockerImage = async(image: Omit<DockerImage, 'id'>) => {
    const newImage = {
      ...image,
      id: Math.random().toString(36).substr(2, 9),
    };
    // console.log(newImage);
    // setDockerImages([...dockerImages, newImage]);
    try {
      const response = await fetch(`${url}docker`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(newImage)
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Docker record added successfully!");
    } 
} catch (error) {
    console.log("An error occurred: ");
}
  };

  const updateDockerImage = (id: string, image: Omit<DockerImage, 'id'>) => {
    const results=dockerImages.map((img) => (img.id === id ? { ...image, id } : img));
    console.log(results);
    fetch(`${url}docker/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(results[0]),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Record updated successfully");
          // setDockerImages((prevImages) =>
          //   prevImages.map((img) => (img.id === id ? { ...data.data } : img))
          // );
        } else {
          console.error("Failed to update record");
        }
      })
      .catch((err) => console.error("Error updating record:", err));

  };

  const deleteDockerImage = (id: string) => {
    fetch(`${url}docker/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Record deleted successfully");
          setDockerImages((prevImages) => prevImages.filter((image) => image.id !== id));
        } else {
          console.error("Failed to delete record");
        }
      })
      .catch((err) => console.error("Error deleting record:", err));
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
