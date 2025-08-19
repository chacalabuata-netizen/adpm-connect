import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Church, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthProps {
  onLogin?: (email: string, role: 'member' | 'admin') => void; // Keep for compatibility
}

const Auth: React.FC<AuthProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent, role: 'member' | 'admin') => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e palavra-passe.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email.trim(), password, displayName.trim());
        if (error) throw error;
        
        toast({
          title: "Registo efetuado",
          description: "Verifique o seu email para confirmar a conta.",
        });
      } else {
        const { error } = await signIn(email.trim(), password);
        if (error) throw error;
        
        toast({
          title: "Bem-vindo!",
          description: `Sessão iniciada com sucesso.`,
        });
      }
    } catch (error: any) {
      toast({
        title: isSignUp ? "Erro ao registar" : "Erro ao iniciar sessão",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary-foreground/20 rounded-full backdrop-blur-sm">
              <Church className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            ADPM Casa de Zadoque
          </h1>
          <p className="text-primary-foreground/80">Montijo</p>
        </div>

        <Card className="border-border/20 shadow-deep backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isSignUp ? 'Criar Conta' : 'Iniciar Sessão'}
            </CardTitle>
            <CardDescription>
              {isSignUp ? 'Registe-se para aceder à plataforma' : 'Aceda à sua conta para continuar'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="member" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="member" className="flex items-center gap-2">
                  <Church className="h-4 w-4" />
                  Membro
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="member">
                <form onSubmit={(e) => handleSubmit(e, 'member')} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="member-name">Nome (opcional)</Label>
                      <Input
                        id="member-name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        autoComplete="name"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="member-email">Email</Label>
                    <Input
                      id="member-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="member-password">Palavra-passe</Label>
                    <Input
                      id="member-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                    variant="sacred"
                  >
                    {loading ? "A processar..." : isSignUp ? "Registar como Membro" : "Entrar como Membro"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="admin">
                <form onSubmit={(e) => handleSubmit(e, 'admin')} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="admin-name">Nome (opcional)</Label>
                      <Input
                        id="admin-name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        autoComplete="name"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email de Administrador</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@adpm.pt"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Palavra-passe de Admin</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                    variant="hero"
                  >
                    {loading ? "A processar..." : isSignUp ? "Registar como Admin" : "Entrar como Admin"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
              >
                {isSignUp ? 'Já tem conta? Iniciar sessão' : 'Não tem conta? Registar'}
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? 'Ao registar-se, aceita os termos de utilização' : 'Primeira vez aqui?'}{' '}
                {!isSignUp && (
                  <span className="text-primary font-medium">
                    Contacte a liderança para obter acesso
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;