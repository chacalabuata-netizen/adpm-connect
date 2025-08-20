import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Heart, 
  Baby, 
  Zap, 
  BookOpen, 
  Music,
  HandHeart,
  Calendar,
  Clock
} from 'lucide-react';
import { useActivities } from '@/hooks/useActivities';
import { useNavigate } from 'react-router-dom';

const Activities = () => {
  const { activities, loading } = useActivities();
  const navigate = useNavigate();

  const getIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('juventude') || titleLower.includes('jovens')) return Zap;
    if (titleLower.includes('feminino') || titleLower.includes('mulher')) return Heart;
    if (titleLower.includes('masculino') || titleLower.includes('homem')) return Users;
    if (titleLower.includes('infantil') || titleLower.includes('criança')) return Baby;
    if (titleLower.includes('grupo') || titleLower.includes('vida')) return BookOpen;
    if (titleLower.includes('louvor') || titleLower.includes('música')) return Music;
    if (titleLower.includes('social') || titleLower.includes('apoio')) return HandHeart;
    return Calendar;
  };

  const formatTime = (timeStart: string, timeEnd?: string) => {
    if (!timeStart) return '';
    const start = timeStart.slice(0, 5); // Format HH:MM
    if (timeEnd) {
      const end = timeEnd.slice(0, 5);
      return `${start} - ${end}`;
    }
    return start;
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayOfWeek] || '';
  };

  const handleParticipate = () => {
    navigate('/contacto');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar atividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-accent rounded-full">
            <Calendar className="h-8 w-8 text-accent-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Atividades da Igreja
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Descubra as diversas formas de participar e crescer na nossa comunidade. 
          Há um lugar especial para cada pessoa!
        </p>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {activities.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhuma atividade disponível
            </h3>
            <p className="text-muted-foreground">
              As atividades serão publicadas em breve. Contacte-nos para mais informações.
            </p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = getIcon(activity.title);
            return (
              <Card key={activity.id} className="hover:shadow-warm transition-all duration-300 hover:-translate-y-1 border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-primary rounded-lg">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{activity.title}</CardTitle>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base mt-3">
                    {activity.description || 'Atividade da igreja'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">
                        {getDayName(activity.day_of_week)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">
                        {formatTime(activity.time_start, activity.time_end)}
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="sacred" className="w-full" onClick={handleParticipate}>
                    Quero Participar
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Call to Action */}
      <Card className="mt-16 bg-gradient-hero text-primary-foreground shadow-deep">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">Interessado em Participar?</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-base">
            Entre em contacto connosco para saber mais sobre qualquer atividade
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <p className="text-primary-foreground/90">
              Todas as atividades são abertas à participação de membros e visitantes. 
              Venha como está e descubra onde Deus o quer usar!
            </p>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleParticipate}
            >
              Entre em Contacto
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activities;