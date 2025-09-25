import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface AuthProps {
  onLoginSuccess?: () => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [memberStatus, setMemberStatus] = useState('visitante');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'member' | 'admin'>('member');
  
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, displayName, memberStatus);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: "Erro",
              description: "Este email já está registrado. Tente fazer login.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro no cadastro",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Cadastro realizado",
            description: "Verifique seu email para confirmar o cadastro.",
          });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Erro",
              description: "Email ou senha incorretos.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro no login",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Login realizado",
            description: "Bem-vindo de volta!",
          });
          onLoginSuccess?.();
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/80 to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/b58bfd74-9a2c-42f9-b3c8-7cf171dbafa5.png" 
              alt="ADPM Casa de Zadoque" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ADPM Casa de Zadoque</h1>
          <p className="text-muted-foreground">Entre ou cadastre-se para continuar</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Autenticação</CardTitle>
            <CardDescription>
              {isSignUp ? 'Crie sua conta' : 'Entre com sua conta'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={(value) => setRole(value as 'member' | 'admin')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="member">Membro</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="member" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Sua senha"
                    />
                  </div>

                  {isSignUp && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Nome de Exibição</Label>
                        <Input
                          id="displayName"
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Seu nome"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="memberStatus">Status de Membro</Label>
                        <Select value={memberStatus} onValueChange={setMemberStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visitante">Visitante</SelectItem>
                            <SelectItem value="congregante">Congregante</SelectItem>
                            <SelectItem value="batizado">Batizado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Processando...' : (isSignUp ? 'Cadastrar como Membro' : 'Entrar como Membro')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Senha</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Senha do administrador"
                    />
                  </div>

                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="admin-displayName">Nome de Exibição</Label>
                      <Input
                        id="admin-displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Nome do administrador"
                      />
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    variant="secondary"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Processando...' : (isSignUp ? 'Cadastrar como Admin' : 'Entrar como Admin')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center mt-4">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
              >
                {isSignUp 
                  ? 'Já tem uma conta? Fazer login' 
                  : 'Não tem uma conta? Cadastrar-se'
                }
              </Button>
            </div>

            {isSignUp && (
              <div className="text-xs text-muted-foreground text-center mt-4 p-3 bg-muted/50 rounded-md">
                <p>
                  <strong>Novo aqui?</strong> Cadastre-se como <em>Visitante</em> se esta é sua primeira vez. 
                  Os administradores podem alterar seu status posteriormente.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}