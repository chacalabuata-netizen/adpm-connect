import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, MapPin } from 'lucide-react';

const Schedule = () => {
  const services = [
    {
      day: 'Domingo',
      time: '10:00',
      title: 'Culto Dominical',
      description: 'Culto principal com adoração, palavra e comunhão',
      type: 'Culto Principal'
    },
    {
      day: 'Quarta-feira',
      time: '20:00',
      title: 'Estudo Bíblico',
      description: 'Aprofundamento na Palavra de Deus',
      type: 'Estudo'
    },
    {
      day: 'Sexta-feira',
      time: '20:00',
      title: 'Reunião de Oração',
      description: 'Momento de oração e intercessão',
      type: 'Oração'
    },
    {
      day: 'Sábado',
      time: '19:00',
      title: 'Reunião da Juventude',
      description: 'Encontro especial para jovens (mensal)',
      type: 'Juventude'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Culto Principal':
        return 'bg-gradient-primary text-primary-foreground';
      case 'Estudo':
        return 'bg-gradient-accent text-accent-foreground';
      case 'Oração':
        return 'bg-primary text-primary-foreground';
      case 'Juventude':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-primary rounded-full">
            <Clock className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Horário dos Cultos
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Junte-se a nós nos nossos momentos de adoração, estudo e comunhão. 
          Todos são bem-vindos!
        </p>
      </div>

      {/* Location Info */}
      <Card className="mb-12 shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Localização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground font-medium mb-2">
            ADPM Casa de Zadoque
          </p>
          <p className="text-muted-foreground">
            Rua Example, 123<br />
            2870-000 Montijo<br />
            Portugal
          </p>
        </CardContent>
      </Card>

      {/* Services Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <Card key={index} className="hover:shadow-warm transition-all duration-300 hover:-translate-y-1 border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(service.type)}`}>
                  {service.type}
                </span>
              </div>
              <CardDescription className="text-base">
                {service.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-primary">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{service.day}</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium text-lg">{service.time}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <Card className="mt-12 bg-gradient-primary text-primary-foreground shadow-deep">
        <CardHeader>
          <CardTitle className="text-2xl">Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Primeira Visita?</h3>
            <p className="text-primary-foreground/90">
              Se é a sua primeira vez connosco, chegue alguns minutos mais cedo. 
              Teremos o maior prazer em recebê-lo e apresentar a nossa comunidade.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Crianças</h3>
            <p className="text-primary-foreground/90">
              Temos programas especiais para crianças durante o culto dominical. 
              As crianças são sempre bem-vindas em todos os nossos encontros.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contacto</h3>
            <p className="text-primary-foreground/90">
              Para mais informações sobre os nossos horários ou atividades especiais, 
              entre em contacto connosco através da secção de contacto.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedule;