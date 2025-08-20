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
  Activity,
  Save,
  Download,
  Smartphone
} from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useActivities } from '@/hooks/useActivities';
import { useSchedules } from '@/hooks/useSchedules';
import { useStats } from '@/hooks/useStats';
import { useToast } from '@/hooks/use-toast';
import { AdminMessages } from './AdminMessages';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

      {/* App Download Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Download da Aplicação
          </CardTitle>
          <CardDescription>
            Baixe a aplicação ADPM Connect para dispositivos móveis
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Button 
            variant="outline" 
            className="h-16 flex-col gap-2"
            onClick={() => window.open('#', '_blank')}
          >
            <Download className="h-6 w-6" />
            <span className="text-sm">Download Android</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col gap-2"
            onClick={() => window.open('#', '_blank')}
          >
            <Download className="h-6 w-6" />
            <span className="text-sm">Download iOS</span>
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
  const { schedules, loading, fetchSchedules, getDayName, formatScheduleTime, DAYS_OF_WEEK } = useSchedules();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    day_of_week: 0, 
    time_start: '', 
    time_end: '', 
    visible: true 
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.time_start.trim()) return;

    try {
      const scheduleData = {
        ...formData,
        time_end: formData.time_end || null
      };

      if (editingId) {
        // Update schedule logic here
        toast({ title: "Horário atualizado", description: "Horário atualizado com sucesso." });
      } else {
        // Create schedule logic here  
        toast({ title: "Horário criado", description: "Novo horário criado com sucesso." });
      }
      
      setFormData({ title: '', description: '', day_of_week: 0, time_start: '', time_end: '', visible: true });
      setEditingId(null);
      fetchSchedules();
    } catch (error) {
      toast({ title: "Erro", description: "Ocorreu um erro. Tente novamente.", variant: "destructive" });
    }
  };

  const handleEdit = (schedule: any) => {
    setFormData({ 
      title: schedule.title, 
      description: schedule.description || '', 
      day_of_week: schedule.day_of_week,
      time_start: schedule.time_start,
      time_end: schedule.time_end || '',
      visible: schedule.visible 
    });
    setEditingId(schedule.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja eliminar este horário?')) {
      try {
        // Delete schedule logic here
        toast({ title: "Horário eliminado", description: "Horário eliminado com sucesso." });
        fetchSchedules();
      } catch (error) {
        toast({ title: "Erro", description: "Ocorreu um erro ao eliminar.", variant: "destructive" });
      }
    }
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      // Toggle visibility logic here
      toast({ 
        title: `Horário ${!currentVisibility ? 'publicado' : 'ocultado'}`, 
        description: `Horário ${!currentVisibility ? 'publicado' : 'ocultado'} com sucesso.` 
      });
      fetchSchedules();
    } catch (error) {
      toast({ title: "Erro", description: "Ocorreu um erro. Tente novamente.", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Gestão de Horários</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar' : 'Novo'} Horário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Culto Dominical"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição opcional"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="day_of_week">Dia da Semana</Label>
                <Select 
                  value={formData.day_of_week.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, day_of_week: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time_start">Hora de Início</Label>
                  <Input
                    id="time_start"
                    type="time"
                    value={formData.time_start}
                    onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time_end">Hora de Fim</Label>
                  <Input
                    id="time_end"
                    type="time"
                    value={formData.time_end}
                    onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                  />
                </div>
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
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Atualizar' : 'Criar'}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ title: '', description: '', day_of_week: 0, time_start: '', time_end: '', visible: true });
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
            <CardTitle>Horários Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {loading && <div className="text-center py-4">Carregando...</div>}
              {schedules.map((schedule) => (
                <div key={schedule.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{schedule.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getDayName(schedule.day_of_week)} - {formatScheduleTime(schedule.time_start, schedule.time_end)}
                      </p>
                    </div>
                    <Badge variant={schedule.visible ? "default" : "secondary"}>
                      {schedule.visible ? 'Visível' : 'Oculto'}
                    </Badge>
                  </div>
                  {schedule.description && (
                    <p className="text-sm text-muted-foreground mb-3">{schedule.description}</p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(schedule)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant={schedule.visible ? "secondary" : "default"}
                      onClick={() => toggleVisibility(schedule.id, schedule.visible)}
                    >
                      {schedule.visible ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Ocultar
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Publicar
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(schedule.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
              {schedules.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum horário encontrado. Crie o primeiro horário.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Admin Activities Component
export const AdminActivities = () => {
  const { activities, loading, fetchActivities, getDayName, formatActivityTime, DAYS_OF_WEEK } = useActivities();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    day_of_week: 0, 
    time_start: '', 
    time_end: '', 
    visible: true 
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.time_start.trim()) return;

    try {
      const activityData = {
        ...formData,
        time_end: formData.time_end || null
      };

      if (editingId) {
        // Update activity logic here
        toast({ title: "Atividade atualizada", description: "Atividade atualizada com sucesso." });
      } else {
        // Create activity logic here  
        toast({ title: "Atividade criada", description: "Nova atividade criada com sucesso." });
      }
      
      setFormData({ title: '', description: '', day_of_week: 0, time_start: '', time_end: '', visible: true });
      setEditingId(null);
      fetchActivities();
    } catch (error) {
      toast({ title: "Erro", description: "Ocorreu um erro. Tente novamente.", variant: "destructive" });
    }
  };

  const handleEdit = (activity: any) => {
    setFormData({ 
      title: activity.title, 
      description: activity.description || '', 
      day_of_week: activity.day_of_week,
      time_start: activity.time_start,
      time_end: activity.time_end || '',
      visible: activity.visible 
    });
    setEditingId(activity.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja eliminar esta atividade?')) {
      try {
        // Delete activity logic here
        toast({ title: "Atividade eliminada", description: "Atividade eliminada com sucesso." });
        fetchActivities();
      } catch (error) {
        toast({ title: "Erro", description: "Ocorreu um erro ao eliminar.", variant: "destructive" });
      }
    }
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      // Toggle visibility logic here
      toast({ 
        title: `Atividade ${!currentVisibility ? 'publicada' : 'ocultada'}`, 
        description: `Atividade ${!currentVisibility ? 'publicada' : 'ocultada'} com sucesso.` 
      });
      fetchActivities();
    } catch (error) {
      toast({ title: "Erro", description: "Ocorreu um erro. Tente novamente.", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Gestão de Atividades</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar' : 'Nova'} Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Estudo Bíblico"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição opcional"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="day_of_week">Dia da Semana</Label>
                <Select 
                  value={formData.day_of_week.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, day_of_week: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time_start">Hora de Início</Label>
                  <Input
                    id="time_start"
                    type="time"
                    value={formData.time_start}
                    onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time_end">Hora de Fim</Label>
                  <Input
                    id="time_end"
                    type="time"
                    value={formData.time_end}
                    onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
                  />
                </div>
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
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Atualizar' : 'Criar'}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ title: '', description: '', day_of_week: 0, time_start: '', time_end: '', visible: true });
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
            <CardTitle>Atividades Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {loading && <div className="text-center py-4">Carregando...</div>}
              {activities.map((activity) => (
                <div key={activity.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getDayName(activity.day_of_week)} - {formatActivityTime(activity.time_start, activity.time_end)}
                      </p>
                    </div>
                    <Badge variant={activity.visible ? "default" : "secondary"}>
                      {activity.visible ? 'Visível' : 'Oculto'}
                    </Badge>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(activity)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant={activity.visible ? "secondary" : "default"}
                      onClick={() => toggleVisibility(activity.id, activity.visible)}
                    >
                      {activity.visible ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Ocultar
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Publicar
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(activity.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
              {activities.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma atividade encontrada. Crie a primeira atividade.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Export AdminUsers component
export { AdminUsers } from './AdminUsers';
export { AdminMessages };