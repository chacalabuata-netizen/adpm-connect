import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Church, 
  Clock, 
  CalendarDays, 
  MessageSquare, 
  Users, 
  Heart,
  BookOpen,
  Star
} from 'lucide-react';
import churchHero from '@/assets/church-hero.jpg';

const Home = () => {
  const quickLinks = [
    {
      icon: Clock,
      title: 'Horário dos Cultos',
      description: 'Veja os horários dos nossos cultos e reuniões',
      path: '/horario',
      variant: 'hero' as const
    },
    {
      icon: CalendarDays,
      title: 'Atividades',
      description: 'Descubra as atividades da nossa comunidade',
      path: '/atividades',
      variant: 'accent' as const
    },
    {
      icon: MessageSquare,
      title: 'Anúncios',
      description: 'Fique por dentro das últimas novidades',
      path: '/anuncios',
      variant: 'sacred' as const
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Conecte-se com outros membros',
      path: '/comunidade',
      variant: 'default' as const
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Amor',
      description: 'Vivemos o amor de Cristo em comunidade'
    },
    {
      icon: BookOpen,
      title: 'Palavra',
      description: 'Baseamos nossa fé na Palavra de Deus'
    },
    {
      icon: Star,
      title: 'Esperança',
      description: 'Compartilhamos a esperança do Evangelho'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={churchHero} 
            alt="Igreja ADPM Casa de Zadoque" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-hero/80" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/b58bfd74-9a2c-42f9-b3c8-7cf171dbafa5.png" 
                alt="ADPM Casa de Zadoque Logo"
                className="h-16 w-16 object-contain mb-4"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
              Bem-vindos à ADPM
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-primary-foreground/90 mb-8">
              Casa de Zadoque - Montijo
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-12 leading-relaxed">
              Uma comunidade de fé que vive e compartilha o amor de Jesus Cristo. 
              Juntos, crescemos em santidade e servimos ao nosso próximo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/horario">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Clock className="h-5 w-5 mr-2" />
                  Ver Horários
                </Button>
              </Link>
              <Link to="/website">
                <Button variant="outline" size="xl" className="w-full sm:w-auto bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
                  Visitar Website
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Acesso Rápido
            </h2>
            <p className="text-muted-foreground text-lg">
              Encontre rapidamente o que procura
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Card key={index} className="hover:shadow-warm transition-all duration-300 hover:-translate-y-1 border-border/50">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-primary rounded-full">
                        <Icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {link.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link to={link.path} className="block">
                      <Button variant={link.variant} className="w-full">
                        Acessar
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nossos Valores
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Os princípios que norteiam nossa caminhada cristã e vida em comunidade
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-accent rounded-full shadow-warm">
                      <Icon className="h-10 w-10 text-accent-foreground" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Junte-se à Nossa Comunidade
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Venha conhecer nossa igreja e fazer parte desta família em Cristo. 
            Todos são bem-vindos!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contacto">
              <Button variant="outline" size="xl" className="w-full sm:w-auto bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
                Entre em Contacto
              </Button>
            </Link>
            <Link to="/website">
              <Button variant="accent" size="xl" className="w-full sm:w-auto">
                Saiba Mais
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;