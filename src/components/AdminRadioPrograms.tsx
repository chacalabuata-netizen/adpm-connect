import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Plus, Clock, User, Calendar, Eye, EyeOff } from 'lucide-react';
import { useRadioPrograms, type RadioProgram } from '@/hooks/useRadioPrograms';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function AdminRadioPrograms() {
  const { programs, loading, createProgram, updateProgram, deleteProgram } = useRadioPrograms();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<RadioProgram | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    host_name: '',
    day_of_week: 0,
    time_start: '',
    time_end: '',
    duration_minutes: 60,
    category: 'general',
    visible: true
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      host_name: '',
      day_of_week: 0,
      time_start: '',
      time_end: '',
      duration_minutes: 60,
      category: 'general',
      visible: true
    });
    setEditingProgram(null);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.time_start) {
      toast({
        title: "Erro de validação",
        description: "Título e hora de início são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Utilizador não encontrado.",
        variant: "destructive"
      });
      return;
    }

    const programData = {
      ...formData,
      author_id: user.id
    };

    let result;
    if (editingProgram) {
      result = await updateProgram(editingProgram.id, programData);
    } else {
      result = await createProgram(programData);
    }

    if (result.error === null) {
      setIsDialogOpen(false);
      resetForm();
    }
  };

  const handleEdit = (program: RadioProgram) => {
    setFormData({
      title: program.title,
      description: program.description || '',
      host_name: program.host_name || '',
      day_of_week: program.day_of_week,
      time_start: program.time_start,
      time_end: program.time_end || '',
      duration_minutes: program.duration_minutes || 60,
      category: program.category,
      visible: program.visible
    });
    setEditingProgram(program);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja eliminar este programa?')) {
      await deleteProgram(id);
    }
  };

  const handleToggleVisibility = async (program: RadioProgram) => {
    await updateProgram(program.id, { visible: !program.visible });
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return days[dayIndex];
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  const categories = [
    { value: 'general', label: 'Geral' },
    { value: 'worship', label: 'Louvor' },
    { value: 'teaching', label: 'Ensino' },
    { value: 'prayer', label: 'Oração' },
    { value: 'youth', label: 'Jovens' },
    { value: 'children', label: 'Infantil' },
    { value: 'music', label: 'Musical' },
    { value: 'talk', label: 'Conversas' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando programas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Programas da Rádio</h2>
          <p className="text-muted-foreground">Gerencie a programação da Rádio ADPM Montijo</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus size={16} />
              Novo Programa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? 'Editar Programa' : 'Criar Novo Programa'}
              </DialogTitle>
              <DialogDescription>
                {editingProgram 
                  ? 'Atualize as informações do programa da rádio.'
                  : 'Adicione um novo programa à programação da rádio.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título do Programa *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Momento de Oração"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Breve descrição do programa..."
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="host_name">Apresentador</Label>
                <Input
                  id="host_name"
                  value={formData.host_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, host_name: e.target.value }))}
                  placeholder="Nome do apresentador"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="day_of_week">Dia da Semana</Label>
                  <Select
                    value={formData.day_of_week.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6].map(day => (
                        <SelectItem key={day} value={day.toString()}>
                          {getDayName(day)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="time_start">Hora de Início *</Label>
                  <Input
                    id="time_start"
                    type="time"
                    value={formData.time_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_start: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="time_end">Hora de Fim</Label>
                  <Input
                    id="time_end"
                    type="time"
                    value={formData.time_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_end: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration_minutes">Duração (min)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    min="5"
                    max="480"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 60 }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="visible"
                  checked={formData.visible}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, visible: checked }))}
                />
                <Label htmlFor="visible">Programa visível publicamente</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {editingProgram ? 'Atualizar' : 'Criar'} Programa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {programs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum programa encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Comece criando o primeiro programa da rádio.
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Criar Primeiro Programa
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          programs.map((program) => (
            <Card key={program.id} className={`${!program.visible ? 'opacity-60' : ''} border-l-4 border-l-primary`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {program.title}
                      {!program.visible && <EyeOff size={16} className="text-muted-foreground" />}
                    </CardTitle>
                    <CardDescription>
                      {program.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleToggleVisibility(program)}
                      variant="ghost"
                      size="sm"
                    >
                      {program.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </Button>
                    <Button
                      onClick={() => handleEdit(program)}
                      variant="ghost"
                      size="sm"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(program.id)}
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
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar size={12} />
                    {getDayName(program.day_of_week)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatTime(program.time_start)} - {program.time_end ? formatTime(program.time_end) : 'Fim'}
                  </Badge>
                  {program.host_name && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <User size={12} />
                      {program.host_name}
                    </Badge>
                  )}
                  {program.category && program.category !== 'general' && (
                    <Badge variant="outline">
                      {categories.find(c => c.value === program.category)?.label || program.category}
                    </Badge>
                  )}
                  {program.duration_minutes && (
                    <Badge variant="outline">
                      {program.duration_minutes}min
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}