import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, MessageSquare, Heart, Share2, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CommunityPage = () => {
  const { toast } = useToast();
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showNewPost, setShowNewPost] = useState(false);

  // Sample community posts data
  const [posts] = useState([
    {
      id: 1,
      author: "Maria Silva",
      title: "Testemunho de Cura",
      content: "Quero partilhar como Deus me curou completamente. Há 3 meses recebi um diagnóstico difícil, mas com as orações da igreja e a fé em Jesus, hoje estou completamente curada! Glória a Deus!",
      timestamp: "2 horas atrás",
      likes: 12,
      comments: 5,
      category: "Testemunho"
    },
    {
      id: 2,
      author: "João Santos",
      title: "Pedido de Oração",
      content: "Irmãos, peço as vossas orações pela minha família. Estamos a passar por um momento difícil financeiramente. Creio que Deus tem o melhor para nós.",
      timestamp: "5 horas atrás",
      likes: 8,
      comments: 15,
      category: "Oração"
    },
    {
      id: 3,
      author: "Ana Costa",
      title: "Versículo do Dia",
      content: "\"Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.\" - Jeremias 29:11",
      timestamp: "1 dia atrás",
      likes: 25,
      comments: 3,
      category: "Reflexão"
    }
  ]);

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    toast({
      title: "Post publicado",
      description: "A sua partilha foi publicada na comunidade.",
    });

    setNewPost({ title: '', content: '' });
    setShowNewPost(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Testemunho': return 'bg-green-100 text-green-800';
      case 'Oração': return 'bg-blue-100 text-blue-800';
      case 'Reflexão': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Comunidade</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Espaço de partilha, oração e comunhão entre os membros da nossa igreja
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Community Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">156</h3>
              <p className="text-muted-foreground">Membros Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">89</h3>
              <p className="text-muted-foreground">Posts Esta Semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">342</h3>
              <p className="text-muted-foreground">Orações Partilhadas</p>
            </CardContent>
          </Card>
        </div>

        {/* New Post Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Partilhar com a Comunidade</CardTitle>
              {!showNewPost && (
                <Button onClick={() => setShowNewPost(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Partilha
                </Button>
              )}
            </div>
          </CardHeader>
          {showNewPost && (
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="post-title">Título</Label>
                  <Input
                    id="post-title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Título da sua partilha..."
                  />
                </div>
                <div>
                  <Label htmlFor="post-content">Conteúdo</Label>
                  <Textarea
                    id="post-content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Partilhe o seu testemunho, pedido de oração ou reflexão..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreatePost}>
                    Publicar
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar na comunidade..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Community Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{post.author}</h3>
                      <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </div>
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{post.content}</p>
                
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Share2 className="h-4 w-4 mr-1" />
                    Partilhar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Guidelines */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Diretrizes da Comunidade</CardTitle>
            <CardDescription>
              Para manter um ambiente saudável e edificante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Mantenha sempre um espírito cristão e respeitoso</li>
              <li>• Partilhe testemunhos que edifiquem e encorajem</li>
              <li>• Peça oração com fé e especificidade quando apropriado</li>
              <li>• Evite discussões doutrinárias divisivas</li>
              <li>• Respeite a privacidade dos outros membros</li>
              <li>• Reporte conteúdo inadequado aos moderadores</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityPage;