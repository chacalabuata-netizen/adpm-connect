import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from 'react';

// Components
import Layout from "./components/Layout";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

// Pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Schedule from "./pages/Schedule";
import Activities from "./pages/Activities";
import Announcements from "./pages/Announcements";
import ContactPage from "./pages/Contact";
import HelpPage from "./pages/Help";
import WebsitePage from "./pages/Website";
import CommunityPage from "./pages/Community";
import NotFound from "./pages/NotFound";

// Admin Components
import { AdminDashboard, AdminAnnouncements, AdminSchedules, AdminActivities } from "./components/AdminComponents";
import { AdminUsers } from "./components/AdminUsers";

// Hooks
import { useAuth } from "./hooks/useAuth";
import { useAnnouncements } from "./hooks/useAnnouncements";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const AppContent = () => {
  const { user, profile, loading, isAdmin, signOut } = useAuth();
  const [adminSection, setAdminSection] = useState('dashboard');

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAdminNavigate = (section: string) => {
    setAdminSection(section);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-foreground"></div>
      </div>
    );
  }

  return (
    <Routes>
      {!user ? (
        <Route path="*" element={<Auth />} />
      ) : isAdmin ? (
        <>
          <Route path="/admin/*" element={
            <Layout userRole="admin" onLogout={handleSignOut}>
              <Routes>
                <Route path="/" element={<AdminDashboard onNavigate={handleAdminNavigate} />} />
                <Route path="/anuncios" element={<AdminAnnouncements />} />
                <Route path="/horarios" element={<AdminSchedules />} />
                <Route path="/atividades" element={<AdminActivities />} />
                <Route path="/utilizadores" element={<AdminUsers />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </Layout>
          } />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </>
      ) : (
        <>
          <Route path="/*" element={
            <Layout userRole="member" onLogout={handleSignOut}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/horario" element={<Schedule />} />
                <Route path="/atividades" element={<Activities />} />
                <Route path="/anuncios" element={<Announcements />} />
                <Route path="/comunidade" element={<CommunityPage />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/ajuda" element={<HelpPage />} />
                <Route path="/website" element={<WebsitePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          } />
        </>
      )}
    </Routes>
  );
};

export default App;
