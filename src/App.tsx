import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Components
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Schedule from "./pages/Schedule";
import Activities from "./pages/Activities";
import Announcements from "./pages/Announcements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<{ email: string; role: 'member' | 'admin' } | null>(null);

  const handleLogin = (email: string, role: 'member' | 'admin') => {
    setUser({ email, role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!user ? (
            <Auth onLogin={handleLogin} />
          ) : (
            <Layout userRole={user.role} onLogout={handleLogout}>
              <Routes>
                {user.role === 'admin' ? (
                  <>
                    <Route path="/admin" element={<div className="container mx-auto px-4 py-12"><h1 className="text-4xl font-bold text-center">Painel Administrativo</h1><p className="text-center text-muted-foreground mt-4">Em breve - sistema de gestão de anúncios</p></div>} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </>
                ) : (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route path="/horario" element={<Schedule />} />
                    <Route path="/atividades" element={<Activities />} />
                    <Route path="/anuncios" element={<Announcements />} />
                    <Route path="/comunidade" element={<div className="container mx-auto px-4 py-12"><h1 className="text-4xl font-bold text-center">Comunidade</h1><p className="text-center text-muted-foreground mt-4">Espaço de partilha e comunhão - em desenvolvimento</p></div>} />
                    <Route path="/contacto" element={<div className="container mx-auto px-4 py-12"><h1 className="text-4xl font-bold text-center">Contacto</h1><p className="text-center text-muted-foreground mt-4">Informações de contacto - em desenvolvimento</p></div>} />
                    <Route path="/ajuda" element={<div className="container mx-auto px-4 py-12"><h1 className="text-4xl font-bold text-center">Ajuda</h1><p className="text-center text-muted-foreground mt-4">Centro de ajuda - em desenvolvimento</p></div>} />
                    <Route path="/website" element={<div className="container mx-auto px-4 py-12"><h1 className="text-4xl font-bold text-center">Website da Igreja</h1><p className="text-center text-muted-foreground mt-4">WebView do site oficial - em desenvolvimento</p></div>} />
                    <Route path="*" element={<NotFound />} />
                  </>
                )}
              </Routes>
            </Layout>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
