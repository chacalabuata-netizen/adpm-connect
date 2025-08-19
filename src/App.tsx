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
import { AdminDashboard, AdminAnnouncements, AdminSchedules, AdminActivities, AdminUsers } from "./components/AdminComponents";

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

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-foreground"></div>
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <Auth />
      ) : isAdmin ? (
        <Layout userRole="admin" onLogout={handleSignOut}>
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/anuncios" element={<AdminAnnouncements />} />
            <Route path="/admin/horarios" element={<AdminSchedules />} />
            <Route path="/admin/atividades" element={<AdminActivities />} />
            <Route path="/admin/utilizadores" element={<AdminUsers />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Layout>
      ) : (
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
      )}
    </>
  );
};

export default App;
