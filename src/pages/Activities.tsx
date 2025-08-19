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
  Calendar
} from 'lucide-react';

const Activities = () => {
  const activities = [
    {
      icon: Zap,
      title: 'Juventude',
      description: 'Encontros especiais para jovens dos 12 aos 25 anos',
      schedule: 'Sábados às 19:00 (mensal)',
      age: '12-25 anos',
      leader: 'Pastor João',
      features: ['Dinâmicas', 'Música', 'Ensino direcionado', 'Convívio']
    },
    {
      icon: Heart,
      title: 'Ministério Feminino',
      description: 'Encontros de mulheres para crescimento espiritual e comunhão',
      schedule: 'Quintas às 19:30 (quinzenal)',
      age: 'Mulheres adultas',
      leader: 'Irmã Maria',
      features: ['Estudos bíblicos', 'Oração', 'Partilha', 'Apoio mútuo']
    },
    {
      icon: Users,
      title: 'Ministério Masculino',
      description: 'Encontros de confraternização e crescimento para homens',
      schedule: 'Sábados às 08:00 (mensal)',
      age: 'Homens adultos',
      leader: 'Irmão Carlos',
      features: ['Café da manhã', 'Reflexão', 'Companheirismo', 'Projetos']
    },
    {
      icon: Baby,
      title: 'Ministério Infantil',
      description: 'Atividades especiais para as nossas crianças',
      schedule: 'Domingos durante o culto',
      age: '3-12 anos',
      leader: 'Tia Ana',
      features: ['Histórias bíblicas', 'Atividades lúdicas', 'Música', 'Ensino adaptado']
    },
    {
      icon: BookOpen,
      title: 'Grupos de Vida',
      description: 'Pequenos grupos para estudo bíblico e comunhão íntima',
      schedule: 'Várias casas, várias datas',
      age: 'Todas as idades',
      leader: 'Vários líderes',
      features: ['Estudo profundo', 'Oração específica', 'Relacionamentos', 'Crescimento']
    },
    {
      icon: Music,
      title: 'Ministério de Louvor',
      description: 'Grupo de música e adoração da igreja',
      schedule: 'Ensaios às terças 20:00',
      age: 'Jovens e adultos',
      leader: 'Irmão Pedro',
      features: ['Instrumentos', 'Vozes', 'Adoração', 'Ministração']
    },
    {
      icon: HandHeart,
      title: 'Ação Social',
      description: 'Projetos de apoio à comunidade local',
      schedule: 'Conforme necessidade',
      age: 'Voluntários adultos',
      leader: 'Diaconia',
      features: ['Cestas básicas', 'Visitas', 'Apoio emocional', 'Evangelização']
    }
  ];

  const getAgeColor = (age: string) => {
    if (age.includes('12-25')) return 'bg-gradient-accent text-accent-foreground';
    if (age.includes('3-12')) return 'bg-gradient-primary text-primary-foreground';
    if (age.includes('adultas') || age.includes('adultos')) return 'bg-primary text-primary-foreground';
    return 'bg-secondary text-secondary-foreground';
  };

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
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <Card key={index} className="hover:shadow-warm transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{activity.title}</CardTitle>
                      <Badge className={`mt-1 ${getAgeColor(activity.age)}`}>
                        {activity.age}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-base mt-3">
                  {activity.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{activity.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Liderança: {activity.leader}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2">O que fazemos:</h4>
                  <div className="flex flex-wrap gap-2">
                    {activity.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button variant="sacred" className="w-full">
                  Quero Participar
                </Button>
              </CardContent>
            </Card>
          );
        })}
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
            <Button variant="outline" size="lg" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
              Entre em Contacto
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activities;