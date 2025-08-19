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

const Announcements = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - Replace with actual data from Supabase
  const announcements = [
    {
      id: 1,
      title: 'Campanha de Natal 2024',
      content: 'Participe da nossa campanha solidária de Natal! Estamos arrecadando brinquedos e alimentos para famílias carenciadas da nossa comunidade. As doações podem ser entregues na igreja até dia 20 de dezembro.',
      date: new Date(2024, 11, 10),
      author: 'Pastor João',
      priority: 'high',
      category: 'Evento',
      views: 45
    },
    {
      id: 2,
      title: 'Novo Horário dos Grupos de Vida',
      content: 'A partir de janeiro, os Grupos de Vida terão novos horários. Consulte com o seu líder de grupo ou contacte a secretaria para mais informações sobre datas e locais.',
      date: new Date(2024, 11, 8),
      author: 'Secretaria',
      priority: 'medium',
      category: 'Informação',
      views: 32
    },
    {
      id: 3,
      title: 'Batismo no Rio Tejo',
      content: 'No próximo domingo, dia 22, realizaremos um batismo especial no Rio Tejo. A cerimónia começará às 15:00. Traga roupas confortáveis e toalha se pretende participar.',
      date: new Date(2024, 11, 15),
      author: 'Pastor João',
      priority: 'high',
      category: 'Cerimónia',
      views: 67
    },
    {
      id: 4,
      title: 'Jejum e Oração - Janeiro 2025',
      content: 'Convidamos toda a igreja para 21 dias de jejum e oração no início do novo ano. Materiais de apoio estarão disponíveis a partir do dia 25 de dezembro.',
      date: new Date(2024, 11, 5),
      author: 'Liderança',
      priority: 'medium',
      category: 'Espiritual',
      views: 28
    },
    {
      id: 5,
      title: 'Festa de Fim de Ano',
      content: 'Dia 31 de dezembro às 20:00 teremos nossa tradicional festa de fim de ano com ceia partilhada. Cada família deve trazer um prato. Inscrições na secretaria.',
      date: new Date(2024, 11, 3),
      author: 'Comissão de Festas',
      priority: 'low',
      category: 'Social',
      views: 89
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-primary text-primary-foreground';
      case 'medium':
        return 'bg-gradient-accent text-accent-foreground';
      case 'low':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Star className="h-4 w-4" />;
      case 'medium':
        return <Bell className="h-4 w-4" />;
      case 'low':
        return <Users className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'há 1 dia';
    if (diffDays < 7) return `há ${diffDays} dias`;
    if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`;
    return `há ${Math.floor(diffDays / 30)} meses`;
  };

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
            <div className="text-2xl font-bold text-accent">{announcements.filter(a => a.priority === 'high').length}</div>
            <div className="text-sm text-muted-foreground">Importantes</div>
          </CardContent>
        </Card>
        <Card className="text-center border-border/50">
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-secondary-foreground">
              {announcements.reduce((sum, a) => sum + a.views, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total de Visualizações</div>
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
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {getPriorityIcon(announcement.priority)}
                        <span className="ml-1 capitalize">{announcement.priority === 'high' ? 'Importante' : announcement.priority === 'medium' ? 'Normal' : 'Informativo'}</span>
                      </Badge>
                      <Badge variant="outline">
                        {announcement.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{announcement.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(announcement.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getTimeAgo(announcement.date)}
                      </span>
                      <span>Por {announcement.author}</span>
                    </CardDescription>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {announcement.views} visualizações
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed mb-4">
                  {announcement.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Visível para todos os membros</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ler mais
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
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