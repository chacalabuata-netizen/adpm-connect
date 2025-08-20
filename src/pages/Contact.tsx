import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChurchMap from '@/components/ChurchMap';
const ContactPage = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate form submission
    toast({
      title: "Mensagem enviada",
      description: "Entraremos em contacto consigo brevemente."
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Entre em Contacto</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Estamos aqui para o ajudar. Entre em contacto connosco através dos meios abaixo ou envie-nos uma mensagem.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informações de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Telefone</h3>
                  <p className="text-muted-foreground">+351 962 130 308</p>
                  <p className="text-sm text-muted-foreground">Segunda a Sexta, 9h-18h</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">contacto@casadezadoque.pt</p>
                  <p className="text-sm text-muted-foreground">Resposta em 24h</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Morada</h3>
                  <p className="text-muted-foreground">
                    Rua da Igreja, nº 123<br />
                    2870-000 Montijo<br />
                    Portugal
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Horários de Atendimento</h3>
                  <div className="text-muted-foreground text-sm">
                    <p>Segunda a Sexta: 9h00 - 18h00</p>
                    <p>Sábado: 9h00 - 13h00</p>
                    <p>Domingo: Apenas cultos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Como Chegar</CardTitle>
            </CardHeader>
            <CardContent>
              <ChurchMap showDetails={false} />
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Envie-nos uma Mensagem
            </CardTitle>
            <CardDescription>
              Preencha o formulário abaixo e entraremos em contacto consigo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="O seu nome" required />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="seu.email@exemplo.com" required />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Assunto *</Label>
                <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Assunto da sua mensagem" required />
              </div>

              <div>
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Escreva aqui a sua mensagem..." rows={6} required />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Send className="h-4 w-4 mr-2" />
                Enviar Mensagem
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default ContactPage;