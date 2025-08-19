import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Clock, 
  CalendarDays, 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Settings
} from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useSchedules } from '@/hooks/useSchedules';
import { useActivities } from '@/hooks/useActivities';
import { useToast } from '@/hooks/use-toast';

// Admin Dashboard Main Component
export const AdminDashboard = () => {
  const stats = [
    { title: 'Anúncios Ativos', value: '12', icon: MessageSquare, color: 'text-blue-600' },
    { title: 'Horários Configurados', value: '8', icon: Clock, color: 'text-green-600' },
    { title: 'Atividades Programadas', value: '15', icon: CalendarDays, color: 'text-purple-600' },
    { title: 'Utilizadores Registados', value: '156', icon: Users, color: 'text-orange-600' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Dashboard Administrativo</h1>
      
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às funcionalidades mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-24 flex-col gap-2" variant="outline">
              <MessageSquare className="h-6 w-6" />
              <span>Novo Anúncio</span>
            </Button>
            <Button className="h-24 flex-col gap-2" variant="outline">
              <Clock className="h-6 w-6" />
              <span>Gerir Horários</span>
            </Button>
            <Button className="h-24 flex-col gap-2" variant="outline">
              <CalendarDays className="h-6 w-6" />
              <span>Nova Atividade</span>
            </Button>
            <Button className="h-24 flex-col gap-2" variant="outline">
              <Users className="h-6 w-6" />
              <span>Gerir Utilizadores</span>
            </Button>
          </div>
        </CardContent>
      </Card>
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
  const { schedules } = useSchedules();
  const { toast } = useToast();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Gestão de Horários</h1>
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Admin Activities Component
export const AdminActivities = () => {
  const { activities } = useActivities();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Gestão de Atividades</h1>
      <Card>
        <CardContent className="p-6 text-center">
          <CalendarDays className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Admin Users Component
export const AdminUsers = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Gestão de Utilizadores</h1>
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
        </CardContent>
      </Card>
    </div>
  );
};