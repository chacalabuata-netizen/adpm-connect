import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Clock, 
  Search,
  Calendar,
  Bell,
  Star,
  Users,
  ChevronRight
} from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAnnouncements';

const Announcements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { announcements, loading } = useAnnouncements();

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'há 1 dia';
    if (diffDays < 7) return `há ${diffDays} dias`;
    if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`;
    return `há ${Math.floor(diffDays / 30)} meses`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar anúncios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-primary rounded-full">
            <MessageSquare className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Anúncios da Igreja
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Mantenha-se atualizado com as últimas novidades, eventos e informações 
          importantes da nossa comunidade.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Procurar anúncios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="text-center border-border/50">
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-primary">{announcements.length}</div>
            <div className="text-sm text-muted-foreground">Total de Anúncios</div>
          </CardContent>
        </Card>
        <Card className="text-center border-border/50">
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-accent">{announcements.filter(a => a.visible).length}</div>
            <div className="text-sm text-muted-foreground">Visíveis</div>
          </CardContent>
        </Card>
        <Card className="text-center border-border/50">
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-secondary-foreground">
              {announcements.length > 0 ? Math.round(announcements.length * 15.5) : 0}
            </div>
            <div className="text-sm text-muted-foreground">Visualizações Estimadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <div className="space-y-6">
        {filteredAnnouncements.length === 0 ? (
          <Card className="text-center py-12 border-border/50">
            <CardContent>
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum anúncio encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os termos de pesquisa ou aguarde por novos anúncios.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-warm transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-gradient-primary text-primary-foreground">
                        <Bell className="h-4 w-4" />
                        <span className="ml-1">Anúncio</span>
                      </Badge>
                      {announcement.visible && (
                        <Badge variant="outline">
                          Público
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2">{announcement.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(announcement.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getTimeAgo(announcement.created_at)}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed mb-4">
                  {announcement.body}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Visível para todos os membros</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Subscribe Notice */}
      <Card className="mt-12 bg-gradient-accent text-accent-foreground shadow-warm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl mb-2">Não Perca Nenhum Anúncio</CardTitle>
          <CardDescription className="text-accent-foreground/80">
            Mantenha-se sempre informado sobre as atividades da igreja
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-accent-foreground/90 mb-4">
            Os anúncios são atualizados regularmente pela liderança da igreja. 
            Visite esta página frequentemente ou contacte-nos para mais informações.
          </p>
          <Button variant="outline" className="bg-accent-foreground/10 border-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground/20">
            Contactar Igreja
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Announcements;