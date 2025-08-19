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
import NotFound from "./pages/NotFound";

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
  const { user, profile, loading, isAdmin } = useAuth();

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
        <Layout userRole="admin" onLogout={() => {}}>
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Layout>
      ) : (
        <Layout userRole="member" onLogout={() => {}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/horario" element={<Schedule />} />
            <Route path="/atividades" element={<Activities />} />
            <Route path="/anuncios" element={<Announcements />} />
            <Route path="/comunidade" element={<div className="container mx-auto px-4 py-12"><h1 className="text-4xl font-bold text-center">Comunidade</h1><p className="text-center text-muted-foreground mt-4">Espaço de partilha e comunhão - em desenvolvimento</p></div>} />
            <Route path="/contacto" element={<div className="container mx-auto px-4 py-12"><h1 className="text-4xl font-bold text-center">Contacto</h1><p className="text-center text-muted-foreground mt-4">Informações de contacto - em desenvolvimento</p></div>} />
            <Route path="/ajuda" element={<div className="container mx-auto px-4 py-12"><h1 className="text-4xl font-bold text-center">Ajuda</h1><p className="text-center text-muted-foreground mt-4">Centro de ajuda - em desenvolvimento</p></div>} />
            <Route path="/website" element={<div className="container mx-auto px-4 py-12"><h1 className="text-4xl font-bold text-center">Website da Igreja</h1><p className="text-center text-muted-foreground mt-4">WebView do site oficial - em desenvolvimento</p></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      )}
    </>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  const { announcements, loading, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [visible, setVisible] = useState(true);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const { user } = useAuth();
    if (!user) return;

    await createAnnouncement({
      title: title.trim(),
      body: body.trim(),
      visible,
      author_id: user.id
    });

    setTitle('');
    setBody('');
    setVisible(true);
  };

  const toggleVisibility = async (announcement: any) => {
    await updateAnnouncement(announcement.id, { visible: !announcement.visible });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem a certeza que deseja eliminar este anúncio?')) {
      await deleteAnnouncement(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Painel Administrativo</h1>
      
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Create Announcement Form */}
        <Card>
          <CardHeader>
            <CardTitle>Novo Anúncio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título do anúncio"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="body">Conteúdo</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Conteúdo do anúncio"
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="visible"
                  checked={visible}
                  onCheckedChange={setVisible}
                />
                <Label htmlFor="visible">Visível para membros</Label>
              </div>
              
              <Button type="submit" className="w-full" variant="sacred">
                Publicar Anúncio
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <Card>
          <CardHeader>
            <CardTitle>Anúncios Publicados</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">A carregar anúncios...</div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">Nenhum anúncio encontrado</div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{announcement.body}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={announcement.visible ? "default" : "secondary"}>
                            {announcement.visible ? 'Visível' : 'Oculto'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(announcement.created_at).toLocaleString('pt-PT')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleVisibility(announcement)}
                        >
                          {announcement.visible ? 'Ocultar' : 'Mostrar'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(announcement.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
