
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Home, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  adminPortal?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, adminPortal = false }) => {
  const { isAuthenticated, logout } = useApp();

  return (
    <div className="min-h-screen bg-docker-light">
      <header className="bg-docker-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            DockerLab
          </Link>
          <div className="flex gap-4">
            {adminPortal && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/student">Student Portal</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin">Admin Home</Link>
                </Button>
                {isAuthenticated && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={logout}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                )}
              </>
            )}
            {!adminPortal && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/">
                    <Home size={16} className="mr-2" />
                    Home
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin">Admin Portal</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-docker-primary">{title}</h1>
        {children}
      </main>
      <footer className="bg-docker-primary text-white p-4 text-center">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} DockerLab - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
