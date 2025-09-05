import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { useAuth } from '@/hooks/useAuth';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useActivities } from '@/hooks/useActivities';
import { useSchedules } from '@/hooks/useSchedules';
import { useRadioPrograms } from '@/hooks/useRadioPrograms';
import { useStats } from '@/hooks/useStats';
import { useContactMessages } from '@/hooks/useContactMessages';
import { AdminRadioPrograms } from '@/components/AdminRadioPrograms';
import { AdminMessages } from './AdminMessages';
import { AdminCommunity } from './AdminCommunity';
import { AdminUsers } from './AdminUsers';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Main Admin Components wrapper
export const AdminComponents = () => {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'announcements':
        return <AdminAnnouncements />;
      case 'activities':
        return <AdminActivities />;
      case 'schedules':
        return <AdminSchedules />;
      case 'radio-programs':
        return <AdminRadioPrograms />;
      case 'community':
        return <AdminCommunity />;
      case 'users':
        return <AdminUsers />;
      case 'messages':
        return <AdminMessages />;
      default:
        return <AdminDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Button
              variant={currentSection === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setCurrentSection('dashboard')}
            >
              Dashboard
            </Button>
            <Button
              variant={currentSection === 'announcements' ? 'default' : 'outline'}
              onClick={() => setCurrentSection('announcements')}
            >
              Anúncios
            </Button>
            <Button
              variant={currentSection === 'activities' ? 'default' : 'outline'}
              onClick={() => setCurrentSection('activities')}
            >
              Atividades
            </Button>
            <Button
              variant={currentSection === 'schedules' ? 'default' : 'outline'}
              onClick={() => setCurrentSection('schedules')}
            >
              Horários
            </Button>
            <Button
              variant={currentSection === 'radio-programs' ? 'default' : 'outline'}
              onClick={() => setCurrentSection('radio-programs')}
            >
              Programas de Rádio
            </Button>
            <Button
              variant={currentSection === 'community' ? 'default' : 'outline'}
              onClick={() => setCurrentSection('community')}
            >
              Comunidade
            </Button>
            <Button
              variant={currentSection === 'users' ? 'default' : 'outline'}
              onClick={() => setCurrentSection('users')}
            >
              Utilizadores
            </Button>
            <Button
              variant={currentSection === 'messages' ? 'default' : 'outline'}
              onClick={() => setCurrentSection('messages')}
            >
              Mensagens
            </Button>
          </div>
        </div>

        {/* Content */}
        {renderCurrentSection()}
      </div>
    </div>
  );
};

// Admin Dashboard Component
export const AdminDashboard = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { stats, loading: statsLoading } = useStats();

  const quickActions = React.useMemo(() => [
    {
      title: 'Anúncios',
      path: 'announcements',
      icon: MessageSquare,
      description: 'Gerir anúncios da igreja'
    },
    {
      title: 'Atividades',
      path: 'activities',
      icon: Activity,
      description: 'Administrar atividades e eventos'
    },
    {
      title: 'Horários',
      path: 'schedules',
      icon: CalendarDays,
      description: 'Consultas e eventos da igreja'
    },
    {
      title: 'Programas de Rádio',
      path: 'radio-programs',
      icon: CalendarDays,
      description: 'Gestão da programação da rádio'
    }
  ], [stats]);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

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
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button 
                key={action.path}
                className="h-20 flex-col"
                variant="outline"
                onClick={() => onNavigate(action.path)}
              >
                <Icon className="h-6 w-6 mb-2" />
                <span className="text-sm text-center">{action.title}</span>
              </Button>
            );
          })}
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => onNavigate('community')}
          >
            <MessageSquare className="h-6 w-6 mb-2" />
            <span className="text-sm">Gerir Comunidade</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col"
            onClick={() => onNavigate('users')}
          >
            <Users className="h-6 w-6 mb-2" />
            <span className="text-sm">Ver Utilizadores</span>
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
            onClick={() => window.open('https://play.google.com/store/apps/details?id=com.adpm.connect', '_blank')}
          >
            <Download className="h-6 w-6" />
            <span className="text-sm">Download Android</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col gap-2"
            onClick={() => window.open('https://apps.apple.com/app/adpm-connect', '_blank')}
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
  const { announcements, loading, createAnnouncement, updateAnnouncement, deleteAnnouncement, fetchAnnouncements } = useAnnouncements();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({ title: '', body: '', visible: true });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) return;
    
    if (!profile?.id) {
      toast({ 
        title: "Erro", 
        description: "Utilizador não autenticado.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      if (editingId) {
        const result = await updateAnnouncement(editingId, formData);
        if (result.data) {
          toast({ title: "Anúncio atualizado", description: "Anúncio atualizado com sucesso." });
          await fetchAnnouncements(); // Refresh the list
        }
      } else {
        const result = await createAnnouncement({ ...formData, author_id: profile.id });
        if (result.data) {
          toast({ title: "Anúncio criado", description: "Novo anúncio criado com sucesso." });
          await fetchAnnouncements(); // Refresh the list
        }
      }
      
      setFormData({ title: '', body: '', visible: true });
      setEditingId(null);
    } catch (error) {
      toast({ title: "Erro", description: "Ocorreu um erro. Tente novamente.", variant: "destructive" });
    }
  };

  const handleToggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const result = await updateAnnouncement(id, { visible: !currentVisibility });
      if (result.data) {
        toast({ 
          title: currentVisibility ? "Anúncio despublicado" : "Anúncio publicado", 
          description: currentVisibility ? "Anúncio foi ocultado com sucesso." : "Anúncio foi publicado com sucesso." 
        });
        await fetchAnnouncements(); // Refresh the list
      }
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao alterar visibilidade do anúncio.", variant: "destructive" });
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
      const result = await deleteAnnouncement(id);
      if (!result.error) {
        toast({ title: "Anúncio eliminado", description: "Anúncio eliminado com sucesso." });
        await fetchAnnouncements(); // Refresh the list
      }
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
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(announcement)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant={announcement.visible ? "secondary" : "default"}
                      onClick={() => handleToggleVisibility(announcement.id, announcement.visible)}
                    >
                      {announcement.visible ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Despublicar
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
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remover
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

// Admin Activities Component 
export const AdminActivities = () => {
  const { 
    activities, 
    loading: activitiesLoading, 
    createActivity, 
    updateActivity, 
    deleteActivity,
    getDayName,
    formatActivityTime,
    DAYS_OF_WEEK
  } = useActivities();
  const { toast } = useToast();
  
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    day_of_week: 0,
    time_start: '',
    time_end: '',
    visible: true
  });

  useEffect(() => {
    if (editingActivity) {
      setNewActivity({
        title: editingActivity.title,
        description: editingActivity.description || '',
        day_of_week: editingActivity.day_of_week,
        time_start: editingActivity.time_start,
        time_end: editingActivity.time_end || '',
        visible: editingActivity.visible
      });
    }
  }, [editingActivity]);

  const resetForm = () => {
    setNewActivity({
      title: '',
      description: '',
      day_of_week: 0,
      time_start: '',
      time_end: '',
      visible: true
    });
    setEditingActivity(null);
    setIsCreatingActivity(false);
  };

  const handleCreateActivity = async () => {
    if (newActivity.title && newActivity.time_start) {
      if (editingActivity) {
        await updateActivity(editingActivity.id, newActivity);
      } else {
        await createActivity(newActivity);
      }
      resetForm();
    }
  };

  const handleToggleVisibility = async (activity: any) => {
    await updateActivity(activity.id, { visible: !activity.visible });
  };

  if (activitiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando atividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Atividades</h2>
          <p className="text-muted-foreground">Administre as atividades e eventos da igreja</p>
        </div>
        <Button onClick={() => setIsCreatingActivity(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Atividade
        </Button>
      </div>

      <div className="grid gap-6">
        {activities.map((activity) => (
          <Card key={activity.id} className={`${!activity.visible ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {activity.title}
                    {!activity.visible && <EyeOff size={16} className="text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription>
                    {activity.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleToggleVisibility(activity)}
                    variant="ghost"
                    size="sm"
                  >
                    {activity.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingActivity(activity);
                      setIsCreatingActivity(true);
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    onClick={() => deleteActivity(activity.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {getDayName(activity.day_of_week)}
                </Badge>
                <Badge variant="outline">
                  {formatActivityTime(activity.time_start, activity.time_end)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreatingActivity} onOpenChange={setIsCreatingActivity}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingActivity ? 'Editar Atividade' : 'Nova Atividade'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="activity-title">Título</Label>
              <Input
                id="activity-title"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                placeholder="Nome da atividade"
              />
            </div>

            <div>
              <Label htmlFor="activity-description">Descrição</Label>
              <Textarea
                id="activity-description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                placeholder="Breve descrição da atividade"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="activity-day">Dia da Semana</Label>
              <Select
                value={newActivity.day_of_week.toString()}
                onValueChange={(value) => setNewActivity({ ...newActivity, day_of_week: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
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
                <Label htmlFor="activity-start-time">Hora de Início</Label>
                <Input
                  id="activity-start-time"
                  type="time"
                  value={newActivity.time_start}
                  onChange={(e) => setNewActivity({ ...newActivity, time_start: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="activity-end-time">Hora de Fim</Label>
                <Input
                  id="activity-end-time"
                  type="time"
                  value={newActivity.time_end}
                  onChange={(e) => setNewActivity({ ...newActivity, time_end: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="activity-visible"
                checked={newActivity.visible}
                onCheckedChange={(checked) => setNewActivity({ ...newActivity, visible: checked })}
              />
              <Label htmlFor="activity-visible">Visível</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={handleCreateActivity}>
                {editingActivity ? 'Atualizar' : 'Criar'} Atividade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Admin Schedules Component
export const AdminSchedules = () => {
  const { 
    schedules, 
    loading: schedulesLoading, 
    createSchedule, 
    updateSchedule, 
    deleteSchedule,
    getDayName,
    formatScheduleTime,
    DAYS_OF_WEEK
  } = useSchedules();
  const { toast } = useToast();
  
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    description: '',
    day_of_week: 0,
    time_start: '',
    time_end: '',
    visible: true
  });

  useEffect(() => {
    if (editingSchedule) {
      setNewSchedule({
        title: editingSchedule.title,
        description: editingSchedule.description || '',
        day_of_week: editingSchedule.day_of_week,
        time_start: editingSchedule.time_start,
        time_end: editingSchedule.time_end || '',
        visible: editingSchedule.visible
      });
    }
  }, [editingSchedule]);

  const resetForm = () => {
    setNewSchedule({
      title: '',
      description: '',
      day_of_week: 0,
      time_start: '',
      time_end: '',
      visible: true
    });
    setEditingSchedule(null);
    setIsCreatingSchedule(false);
  };

  const handleCreateSchedule = async () => {
    if (newSchedule.title && newSchedule.time_start) {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, newSchedule);
      } else {
        await createSchedule(newSchedule);
      }
      resetForm();
    }
  };

  const handleToggleVisibility = async (schedule: any) => {
    await updateSchedule(schedule.id, { visible: !schedule.visible });
  };

  if (schedulesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando horários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Horários</h2>
          <p className="text-muted-foreground">Administre os horários de cultos e eventos</p>
        </div>
        <Button onClick={() => setIsCreatingSchedule(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Horário
        </Button>
      </div>

      <div className="grid gap-6">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className={`${!schedule.visible ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {schedule.title}
                    {!schedule.visible && <EyeOff size={16} className="text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription>
                    {schedule.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleToggleVisibility(schedule)}
                    variant="ghost"
                    size="sm"
                  >
                    {schedule.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingSchedule(schedule);
                      setIsCreatingSchedule(true);
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    onClick={() => deleteSchedule(schedule.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {getDayName(schedule.day_of_week)}
                </Badge>
                <Badge variant="outline">
                  {formatScheduleTime(schedule.time_start, schedule.time_end)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreatingSchedule} onOpenChange={setIsCreatingSchedule}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? 'Editar Horário' : 'Novo Horário'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="schedule-title">Título</Label>
              <Input
                id="schedule-title"
                value={newSchedule.title}
                onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                placeholder="Nome do evento/culto"
              />
            </div>

            <div>
              <Label htmlFor="schedule-description">Descrição</Label>
              <Textarea
                id="schedule-description"
                value={newSchedule.description}
                onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                placeholder="Breve descrição do evento"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="schedule-day">Dia da Semana</Label>
              <Select
                value={newSchedule.day_of_week.toString()}
                onValueChange={(value) => setNewSchedule({ ...newSchedule, day_of_week: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
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
                <Label htmlFor="schedule-start-time">Hora de Início</Label>
                <Input
                  id="schedule-start-time"
                  type="time"
                  value={newSchedule.time_start}
                  onChange={(e) => setNewSchedule({ ...newSchedule, time_start: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="schedule-end-time">Hora de Fim</Label>
                <Input
                  id="schedule-end-time"
                  type="time"
                  value={newSchedule.time_end}
                  onChange={(e) => setNewSchedule({ ...newSchedule, time_end: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="schedule-visible"
                checked={newSchedule.visible}
                onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, visible: checked })}
              />
              <Label htmlFor="schedule-visible">Visível</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreatingSchedule(false);
                  setEditingSchedule(null);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateSchedule}>
                {editingSchedule ? 'Atualizar' : 'Criar'} Horário
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
