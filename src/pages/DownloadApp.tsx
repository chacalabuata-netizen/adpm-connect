import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Smartphone, 
  Download, 
  CheckCircle, 
  QrCode, 
  Apple, 
  Play,
  Monitor,
  Loader2,
  Wifi,
  Bell,
  Users,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function DownloadApp() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if app is already installed (standalone mode)
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || 
                   (window.navigator as any).standalone === true);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast({
        title: "🎉 Instalado com sucesso!",
        description: "O aplicativo ADPM Connect foi instalado no seu dispositivo.",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Instalação não disponível",
        description: "Este aplicativo já está instalado ou seu navegador não suporta instalação.",
        variant: "destructive",
      });
      return;
    }

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        toast({
          title: "Instalando...",
          description: "O aplicativo está sendo instalado no seu dispositivo.",
        });
      } else {
        toast({
          title: "Instalação cancelada",
          description: "Você pode instalar o aplicativo a qualquer momento.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na instalação",
        description: "Ocorreu um erro durante a instalação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const features = [
    {
      icon: Users,
      title: "Comunidade",
      description: "Conecte-se com outros membros e participe de discussões"
    },
    {
      icon: Calendar,
      title: "Cronograma",
      description: "Veja os cronogramas de cultos e atividades da igreja"
    },
    {
      icon: MessageSquare,
      title: "Anúncios",
      description: "Receba as últimas notícias e anúncios da igreja"
    },
    {
      icon: Bell,
      title: "Notificações",
      description: "Seja notificado sobre eventos importantes"
    },
    {
      icon: Wifi,
      title: "Funciona Offline",
      description: "Acesse conteúdo mesmo sem conexão com a internet"
    },
    {
      icon: Monitor,
      title: "Multiplataforma",
      description: "Disponível para Android, iOS e computador"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Smartphone className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Download ADPM Connect</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Tenha a igreja sempre com você no seu dispositivo móvel
          </p>
          
          {isStandalone ? (
            <Badge variant="secondary" className="text-base px-4 py-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              Aplicativo já instalado!
            </Badge>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleInstallClick}
                disabled={isInstalling || !deferredPrompt}
                size="lg"
                className="min-w-48"
              >
                {isInstalling ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Instalando...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Instalar Aplicativo
                  </>
                )}
              </Button>
              
              {!deferredPrompt && (
                <p className="text-sm text-muted-foreground">
                  Para instalar, use o menu do seu navegador e selecione "Instalar aplicativo"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Installation Status */}
        {isInstalled && (
          <Card className="mb-8 border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  🎉 Instalação Concluída!
                </h3>
                <p className="text-green-700">
                  O aplicativo ADPM Connect foi instalado com sucesso no seu dispositivo. 
                  Você pode encontrá-lo na sua tela inicial ou menu de aplicativos.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Installation Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Como Instalar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Play className="h-4 w-4 text-green-600" />
                  Android
                </h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Abra o Chrome ou outro navegador</li>
                  <li>2. Visite esta página</li>
                  <li>3. Toque no botão "Instalar Aplicativo"</li>
                  <li>4. Confirme a instalação</li>
                  <li>5. O app aparecerá na sua tela inicial</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Apple className="h-4 w-4 text-gray-600" />
                  iOS (iPhone/iPad)
                </h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Abra o Safari</li>
                  <li>2. Visite esta página</li>
                  <li>3. Toque no ícone de compartilhar</li>
                  <li>4. Selecione "Adicionar à Tela Inicial"</li>
                  <li>5. Confirme tocando em "Adicionar"</li>
                </ol>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Dica</h4>
              <p className="text-sm text-muted-foreground">
                Após a instalação, o aplicativo funcionará como um aplicativo nativo, 
                com ícone próprio e funcionamento offline para muitas funcionalidades.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requisitos do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Android</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Android 5.0+</li>
                  <li>• Chrome 70+</li>
                  <li>• 50MB de espaço</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">iOS</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• iOS 11.3+</li>
                  <li>• Safari</li>
                  <li>• 50MB de espaço</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Desktop</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Windows 10+</li>
                  <li>• macOS 10.14+</li>
                  <li>• Chrome, Edge ou Safari</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}