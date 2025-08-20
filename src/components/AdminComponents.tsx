import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  TrendingUp,
  Clock, 
  CalendarDays, 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  EyeOff,
  Activity
} from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useStats } from '@/hooks/useStats';
import { useToast } from '@/hooks/use-toast';
import { AdminMessages } from './AdminMessages';

// Admin Dashboard Component
export const AdminDashboard = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { stats, loading: statsLoading } = useStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Gerencie todos os aspectos da aplicação ADPM Connect
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Anúncios Ativos
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats.totalAnnouncements}
            </div>
            <p className="text-xs text-muted-foreground">
              Publicados e visíveis
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Horários Ativos
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats.activeSchedules}
            </div>
            <p className="text-xs text-muted-foreground">
              Cultos programados
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Atividades Ativas
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats.totalActivities}
            </div>
            <p className="text-xs text-muted-foreground">
              Eventos programados
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Membros Registados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              Utilizadores ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Posts da Comunidade
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats.totalPosts}
            </div>
            <p className="text-xs text-muted-foreground">
              Partilhas da comunidade
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mensagens por Ler
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {statsLoading ? "..." : stats.unreadMessages}
            </div>
            <p className="text-xs text-muted-foreground">
              Contactos pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às funcionalidades mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button 
            className="h-20 flex-col"
            onClick={() => onNavigate('announcements')}
          >
            <Plus className="h-6 w-6 mb-2" />
            Criar Anúncio
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => onNavigate('schedules')}
          >
            <Clock className="h-6 w-6 mb-2" />
            Gerir Horários
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => onNavigate('activities')}
          >
            <Activity className="h-6 w-6 mb-2" />
            Gerir Atividades
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => onNavigate('users')}
          >
            <Users className="h-6 w-6 mb-2" />
            Ver Utilizadores
          </Button>
        </CardContent>
      </Card>

      {/* Messages Preview */}
      {stats.unreadMessages > 0 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Mensagens Pendentes</CardTitle>
            <CardDescription>
              Tem {stats.unreadMessages} mensagem{stats.unreadMessages > 1 ? 's' : ''} por responder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onNavigate('messages')}
              className="w-full"
            >
              Ver Mensagens
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Admin Announcements Component
export const AdminAnnouncements = () => {
  const { announcements, loading, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ title: '', body: '', visible: true });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) return;

    try {
      if (editingId) {
        await updateAnnouncement(editingId, formData);
        toast({ title: "Anúncio atualizado", description: "Anúncio atualizado com sucesso." });
      } else {
        await createAnnouncement({ ...formData, author_id: 'current-user-id' });
        toast({ title: "Anúncio criado", description: "Novo anúncio criado com sucesso." });
      }
      
      setFormData({ title: '', body: '', visible: true });
      setEditingId(null);
    } catch (error) {
      toast({ title: "Erro", description: "Ocorreu um erro. Tente novamente.", variant: "destructive" });
    }
  };

  const handleEdit = (announcement: any) => {
    setFormData({ 
      title: announcement.title, 
      body: announcement.body, 
      visible: announcement.visible 
    });
    setEditingId(announcement.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja eliminar este anúncio?')) {
      await deleteAnnouncement(id);
      toast({ title: "Anúncio eliminado", description: "Anúncio eliminado com sucesso." });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Gestão de Anúncios</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar' : 'Novo'} Anúncio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="body">Conteúdo</Label>
                <Textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="visible"
                  checked={formData.visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                />
                <Label htmlFor="visible">Visível</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Atualizar' : 'Criar'}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ title: '', body: '', visible: true });
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>Anúncios Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <Badge variant={announcement.visible ? "default" : "secondary"}>
                      {announcement.visible ? 'Visível' : 'Oculto'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{announcement.body}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(announcement)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Admin Schedules Component
export const AdminSchedules = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Horários</h1>
        <p className="text-muted-foreground">
          Gerencie os horários de cultos e eventos da igreja
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Funcionalidade em Desenvolvimento</h3>
          <p className="text-muted-foreground">
            O sistema de gestão de horários estará disponível em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Admin Activities Component
export const AdminActivities = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Atividades</h1>
        <p className="text-muted-foreground">
          Gerencie as atividades e eventos especiais da igreja
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6 text-center">
          <CalendarDays className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Funcionalidade em Desenvolvimento</h3>
          <p className="text-muted-foreground">
            O sistema de gestão de atividades estará disponível em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Export AdminUsers component
export { AdminUsers } from './AdminUsers';
export { AdminMessages };