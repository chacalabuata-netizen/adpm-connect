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
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useActivities } from '@/hooks/useActivities';
import { useSchedules } from '@/hooks/useSchedules';
import { useStats } from '@/hooks/useStats';
import { useToast } from '@/hooks/use-toast';
import { AdminMessages } from './AdminMessages';
import { AdminCommunity } from './AdminCommunity';
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
            onClick={() => onNavigate('community')}
          >
            <MessageSquare className="h-6 w-6 mb-2" />
            Gerir Comunidade
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
  const [formData, setFormData] = useState({ title: '', body: '', visible: true });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) return;

    try {
      if (editingId) {
        const result = await updateAnnouncement(editingId, formData);
        if (result.data) {
          toast({ title: "Anúncio atualizado", description: "Anúncio atualizado com sucesso." });
          await fetchAnnouncements(); // Refresh the list
        }
      } else {
        const result = await createAnnouncement({ ...formData, author_id: 'current-user-id' });
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

  const handleCreateActivity = async () => {
    try {
      if (editingActivity) {
        await updateActivity(editingActivity.id, {
          ...newActivity,
          day_of_week: parseInt(newActivity.day_of_week.toString()),
        });
      } else {
        await createActivity({
          ...newActivity,
          day_of_week: parseInt(newActivity.day_of_week.toString()),
        });
      }

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
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Atividades</h1>
        <p className="text-muted-foreground">
          Gerencie as atividades e eventos da igreja
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Nova Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => {
                setIsCreatingActivity(true);
                setEditingActivity(null);
                setNewActivity({
                  title: '',
                  description: '',
                  day_of_week: 0,
                  time_start: '',
                  time_end: '',
                  visible: true
                });
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Atividade
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividades Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activities.map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getDayName(activity.day_of_week)} - {formatActivityTime(activity.time_start, activity.time_end)}
                        </p>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={activity.visible ? "default" : "secondary"}>
                          {activity.visible ? "Visível" : "Oculto"}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingActivity(activity);
                            setIsCreatingActivity(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateActivity(activity.id, { visible: !activity.visible })}
                        >
                          <EyeOff className="h-4 w-4 mr-1" />
                          {activity.visible ? 'Ocultar' : 'Publicar'}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Tem certeza que deseja eliminar esta atividade?')) {
                              deleteActivity(activity.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
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

      {/* Create/Edit Activity Dialog */}
      <Dialog open={isCreatingActivity} onOpenChange={setIsCreatingActivity}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingActivity ? 'Editar Atividade' : 'Nova Atividade'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="activity-title">Título</Label>
              <Input
                id="activity-title"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                placeholder="Ex: Estudo Bíblico"
              />
            </div>
            
            <div>
              <Label htmlFor="activity-description">Descrição</Label>
              <Textarea
                id="activity-description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                placeholder="Descrição opcional"
              />
            </div>

            <div>
              <Label htmlFor="activity-day">Dia da Semana</Label>
              <Select 
                value={newActivity.day_of_week.toString()} 
                onValueChange={(value) => setNewActivity({ ...newActivity, day_of_week: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="activity-start">Hora de Início</Label>
                <Input
                  id="activity-start"
                  type="time"
                  value={newActivity.time_start}
                  onChange={(e) => setNewActivity({ ...newActivity, time_start: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="activity-end">Hora de Fim</Label>
                <Input
                  id="activity-end"
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
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreatingActivity(false);
                  setEditingActivity(null);
                }}
              >
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

  const handleCreateSchedule = async () => {
    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, {
          ...newSchedule,
          day_of_week: parseInt(newSchedule.day_of_week.toString()),
        });
      } else {
        await createSchedule({
          ...newSchedule,
          day_of_week: parseInt(newSchedule.day_of_week.toString()),
        });
      }

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
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Horários</h1>
        <p className="text-muted-foreground">
          Gerencie os horários de cultos e eventos da igreja
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Novo Horário</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => {
                setIsCreatingSchedule(true);
                setEditingSchedule(null);
                setNewSchedule({
                  title: '',
                  description: '',
                  day_of_week: 0,
                  time_start: '',
                  time_end: '',
                  visible: true
                });
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Horário
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horários Existentes</CardTitle>
          </CardHeader>
          <CardContent>
            {schedulesLoading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{schedule.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getDayName(schedule.day_of_week)} - {formatScheduleTime(schedule.time_start, schedule.time_end)}
                        </p>
                        {schedule.description && (
                          <p className="text-sm text-muted-foreground mt-1">{schedule.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={schedule.visible ? "default" : "secondary"}>
                          {schedule.visible ? "Visível" : "Oculto"}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingSchedule(schedule);
                            setIsCreatingSchedule(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateSchedule(schedule.id, { visible: !schedule.visible })}
                        >
                          <EyeOff className="h-4 w-4 mr-1" />
                          {schedule.visible ? 'Ocultar' : 'Publicar'}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Tem certeza que deseja eliminar este horário?')) {
                              deleteSchedule(schedule.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
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

      {/* Create/Edit Schedule Dialog */}
      <Dialog open={isCreatingSchedule} onOpenChange={setIsCreatingSchedule}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSchedule ? 'Editar Horário' : 'Novo Horário'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="schedule-title">Título</Label>
              <Input
                id="schedule-title"
                value={newSchedule.title}
                onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                placeholder="Ex: Culto Dominical"
              />
            </div>
            
            <div>
              <Label htmlFor="schedule-description">Descrição</Label>
              <Textarea
                id="schedule-description"
                value={newSchedule.description}
                onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                placeholder="Descrição opcional"
              />
            </div>

            <div>
              <Label htmlFor="schedule-day">Dia da Semana</Label>
              <Select 
                value={newSchedule.day_of_week.toString()} 
                onValueChange={(value) => setNewSchedule({ ...newSchedule, day_of_week: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule-start">Hora de Início</Label>
                <Input
                  id="schedule-start"
                  type="time"
                  value={newSchedule.time_start}
                  onChange={(e) => setNewSchedule({ ...newSchedule, time_start: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="schedule-end">Hora de Fim</Label>
                <Input
                  id="schedule-end"
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