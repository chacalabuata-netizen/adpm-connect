import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, HelpCircle, Book, Users, Phone, Mail } from 'lucide-react';

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      title: "Informações Gerais",
      icon: HelpCircle,
      questions: [
        {
          question: "Quais são os horários dos cultos?",
          answer: "Os nossos cultos principais são: Domingo às 10h00 (culto matinal) e às 18h30 (culto vespertino). Também temos culto de oração à Quarta-feira às 19h30."
        },
        {
          question: "Como posso tornar-me membro da igreja?",
          answer: "Para se tornar membro, deve participar no nosso curso de novos membros, que acontece mensalmente. Entre em contacto connosco para mais informações sobre as próximas datas."
        },
        {
          question: "A igreja tem estacionamento?",
          answer: "Sim, temos estacionamento gratuito disponível no nosso edifício. Há também lugares na rua nas proximidades."
        },
        {
          question: "Há algum dress code para os cultos?",
          answer: "Não temos um dress code específico. Encorajamos as pessoas a vestirem-se de forma respeitosa e confortável para adorar."
        }
      ]
    },
    {
      title: "Actividades e Ministérios",
      icon: Users,
      questions: [
        {
          question: "Que ministérios estão disponíveis?",
          answer: "Temos vários ministérios: Louvor, Crianças, Jovens, Mulheres, Homens, Visitação, Diaconia, e muito mais. Fale connosco para descobrir onde pode servir."
        },
        {
          question: "Há actividades para crianças?",
          answer: "Sim! Temos escola dominical para crianças durante o culto matinal, actividades especiais durante as férias, e um ministério dedicado aos mais pequenos."
        },
        {
          question: "Como posso participar no grupo de jovens?",
          answer: "O nosso grupo de jovens reúne-se aos Sábados às 19h00. Jovens dos 12 aos 25 anos são bem-vindos. Venha experimentar!"
        },
        {
          question: "Há estudos bíblicos durante a semana?",
          answer: "Sim, temos células de estudo bíblico que se reúnem em casas durante a semana. Entre em contacto para encontrar uma célula perto de si."
        }
      ]
    },
    {
      title: "Apoio Espiritual",
      icon: Book,
      questions: [
        {
          question: "Posso solicitar oração pela minha situação?",
          answer: "Absolutamente! Pode pedir oração através do nosso formulário online, pessoalmente, ou contactando directamente os nossos pastores."
        },
        {
          question: "Como posso agendar aconselhamento pastoral?",
          answer: "Para agendar aconselhamento, contacte a secretaria da igreja pelo telefone ou email. Os nossos pastores estão disponíveis para orientação espiritual."
        },
        {
          question: "A igreja oferece apoio em situações de crise?",
          answer: "Sim, temos uma equipa de apoio pastoral disponível 24/7 para emergências espirituais e situações de crise. Contacte-nos imediatamente se precisar."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Centro de Ajuda</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Encontre respostas para as suas perguntas mais frequentes ou entre em contacto connosco para mais ajuda.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar nas perguntas frequentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-4xl mx-auto space-y-8">
        {filteredCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="h-5 w-5" />
                {category.title}
                <Badge variant="secondary">{category.questions.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}

        {filteredCategories.length === 0 && searchTerm && (
          <Card>
            <CardContent className="text-center py-12">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Não encontrámos respostas para "{searchTerm}"
              </p>
              <Button onClick={() => setSearchTerm('')}>
                Limpar pesquisa
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contact Support */}
      <Card className="max-w-2xl mx-auto mt-12">
        <CardHeader>
          <CardTitle className="text-center">Não encontrou o que procurava?</CardTitle>
          <CardDescription className="text-center">
            Entre em contacto connosco directamente e teremos todo o gosto em ajudar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              +351 212 345 678
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              contacto@casadezadoque.pt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;