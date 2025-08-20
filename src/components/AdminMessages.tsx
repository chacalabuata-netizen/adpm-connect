import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Mail, Clock, User } from 'lucide-react';
import { useContactMessages } from '@/hooks/useContactMessages';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const AdminMessages = () => {
  const { messages, loading, markAsRead } = useContactMessages();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar mensagens...</p>
        </div>
      </div>
    );
  }

  const unreadMessages = messages.filter(msg => !msg.read_at);
  const readMessages = messages.filter(msg => msg.read_at);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mensagens de Contacto</h1>
        <p className="text-muted-foreground">
          Gerencie as mensagens recebidas através do formulário de contacto
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Mensagens</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Ler</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{unreadMessages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lidas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readMessages.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Unread Messages */}
      {unreadMessages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Mensagens por Ler</h2>
          <div className="grid gap-4">
            {unreadMessages.map((message) => (
              <Card key={message.id} className="border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg">{message.name}</CardTitle>
                      <Badge variant="default">Nova</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatDistanceToNow(new Date(message.created_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </div>
                  </div>
                  <CardDescription>
                    <strong>Email:</strong> {message.email}<br />
                    <strong>Assunto:</strong> {message.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{message.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => markAsRead(message.id)}
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Marcar como Lida
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject}`)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Responder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Read Messages */}
      {readMessages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Mensagens Lidas</h2>
          <div className="grid gap-4">
            {readMessages.map((message) => (
              <Card key={message.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg">{message.name}</CardTitle>
                      <Badge variant="secondary">Lida</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatDistanceToNow(new Date(message.created_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </div>
                  </div>
                  <CardDescription>
                    <strong>Email:</strong> {message.email}<br />
                    <strong>Assunto:</strong> {message.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{message.message}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject}`)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Responder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {messages.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma mensagem</h3>
            <p className="text-muted-foreground">
              Ainda não foram recebidas mensagens através do formulário de contacto.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};