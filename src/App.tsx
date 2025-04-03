
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { useEffect } from "react"

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import DockerImageList from "./pages/DockerImageList";
import DockerImageForm from "./pages/DockerImageForm";
import DocumentList from "./pages/DocumentList";
import DocumentForm from "./pages/DocumentForm";
import DocumentView from "./pages/DocumentView";
import StudentHome from "./pages/StudentHome";
import SemesterView from "./pages/SemesterView";
import ImageDetails from "./pages/ImageDetails";
import LabsList from "./pages/LabsList";
import StudentDocumentList from "./pages/StudentDocumentList";

const queryClient = new QueryClient

const App = () => {
  useEffect(() => {
    localStorage.setItem({
         "dockerImages": [
        {
            "semester": "4",
            "subject": "Networking Lab",
            "pullCommand": "sudo docker pull 192.168.104.2:5000/networking-lab",
            "runCommand": "xhost +  sudo docker run --rm -it     --name networking-lab     --net=host     --cap-add=NET_ADMIN     --cap-add=NET_RAW     --cap-add=SYS_ADMIN     --cap-add=SYS_PTRACE     -v /var/run/docker.sock:/var/run/docker.sock     -v /tmp/.X11-unix:/tmp/.X11-unix     -v $HOME/kathara_labs:/home/netuser/kathara_labs     -e DISPLAY=$DISPLAY     -e PULSE_SERVER=unix:${XDG_RUNTIME_DIR}/pulse/native     -v ${XDG_RUNTIME_DIR}/pulse/native:${XDG_RUNTIME_DIR}/pulse/native     --privileged     --user root     192.168.104.2:5000/networking-lab /bin/bash",
            "instructions": "",
            "notes": "",
            "id": "tq35xzdze"
        }
    ],
    })
  }, [])
  
 return ( <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Common Routes */}
            <Route path="/" element={<Index />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/docker-images" element={<DockerImageList />} />
            <Route path="/admin/docker-images/add" element={<DockerImageForm />} />
            <Route path="/admin/docker-images/edit/:id" element={<DockerImageForm />} />
            <Route path="/admin/documents" element={<DocumentList />} />
            <Route path="/admin/documents/add" element={<DocumentForm />} />
            <Route path="/admin/documents/edit/:id" element={<DocumentForm />} />
            <Route path="/admin/documents/view/:id" element={<DocumentView adminView={true} />} />
            
            {/* Student Routes */}
            <Route path="/student" element={<StudentHome />} />
            <Route path="/student/semester/:semester" element={<SemesterView />} />
            <Route path="/student/image/:id" element={<ImageDetails />} />
            <Route path="/student/labs" element={<LabsList />} />
            <Route path="/student/documents" element={<StudentDocumentList />} />
            <Route path="/student/document/:id" element={<DocumentView />} />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
)}

export default App;
