import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Globe, Smartphone, Monitor, RefreshCw } from 'lucide-react';

const WebsitePage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Simulate website links and resources
  const websiteResources = [
    {
      title: "Site Principal",
      description: "Website oficial da ADPM Casa de Zadoque",
      url: "https://casadezadoque.pt",
      type: "primary"
    },
    {
      title: "Transmissões ao Vivo",
      description: "Assista aos nossos cultos online",
      url: "https://youtube.com/@casadezadoque",
      type: "live"
    },
    {
      title: "Blog da Igreja",
      description: "Artigos e reflexões espirituais",
      url: "https://blog.casadezadoque.pt",
      type: "blog"
    },
    {
      title: "Loja Online",
      description: "Livros, música e recursos cristãos",
      url: "https://loja.casadezadoque.pt",
      type: "store"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Website da Igreja</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Aceda ao nosso website principal e outros recursos online
        </p>
      </div>

      {/* Main Website Embed */}
      <Card className="max-w-6xl mx-auto mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Principal
              </CardTitle>
              <CardDescription>
                Website oficial da ADPM Casa de Zadoque - Montijo
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://casadezadoque.pt" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir Nova Janela
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden bg-muted">
            <div className="bg-card border-b p-4 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm text-muted-foreground">https://casadezadoque.pt</span>
              </div>
            </div>
            
            {/* Simulated website preview */}
            <div className="aspect-video bg-gradient-hero flex items-center justify-center relative">
              {isLoading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-foreground"></div>
              ) : (
                <div className="text-center text-primary-foreground p-8">
                  <Globe className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">ADPM Casa de Zadoque</h3>
                  <p className="text-primary-foreground/80">Website em desenvolvimento</p>
                  <Badge variant="secondary" className="mt-4">
                    Pré-visualização
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Website Resources */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Recursos Online</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {websiteResources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {resource.title}
                  </span>
                  <Badge variant={resource.type === 'primary' ? 'default' : 'secondary'}>
                    {resource.type === 'primary' ? 'Principal' : 
                     resource.type === 'live' ? 'Ao Vivo' :
                     resource.type === 'blog' ? 'Blog' : 'Loja'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visitar Site
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Device Compatibility */}
      <Card className="max-w-2xl mx-auto mt-12">
        <CardHeader>
          <CardTitle className="text-center">Compatibilidade</CardTitle>
          <CardDescription className="text-center">
            Os nossos websites são optimizados para todos os dispositivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <Monitor className="h-8 w-8 mx-auto mb-2 text-primary" />
              <span className="text-sm text-muted-foreground">Desktop</span>
            </div>
            <div className="text-center">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-primary" />
              <span className="text-sm text-muted-foreground">Mobile</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsitePage;