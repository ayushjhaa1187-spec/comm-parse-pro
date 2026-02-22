import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import BrdGenerate from "./pages/BrdGenerate";
import BrdList from "./pages/BrdList";
import Metrics from "./pages/Metrics";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/dashboard/brds" element={<ProtectedRoute><BrdList /></ProtectedRoute>} />
          <Route path="/dashboard/brds/generate/:projectId" element={<ProtectedRoute><BrdGenerate /></ProtectedRoute>} />
          <Route path="/dashboard/brds/:id" element={<ProtectedRoute><BrdGenerate /></ProtectedRoute>} />
          <Route path="/dashboard/metrics" element={<ProtectedRoute><Metrics /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
