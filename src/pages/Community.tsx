import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, MessageSquare, Heart, Share2, Plus, Search, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCommunity } from '@/hooks/useCommunity';
import { ImageUpload } from '@/components/ImageUpload';
import { PostComments } from '@/components/PostComments';
import { PostImages } from '@/components/PostImages';

const CommunityPage = () => {
  const { toast } = useToast();
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general', media_urls: [] as string[] });
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { posts, loading, createPost, toggleLike } = useCommunity();

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      await createPost(newPost);
      setNewPost({ title: '', content: '', category: 'general', media_urls: [] });
      setShowNewPost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleImagesUploaded = (urls: string[]) => {
    setNewPost({ ...newPost, media_urls: urls });
  };

  const handleLike = async (postId: string) => {
    try {
      await toggleLike(postId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) return `há ${diffHours} horas`;
    if (diffDays === 1) return 'há 1 dia';
    if (diffDays < 7) return `há ${diffDays} dias`;
    return date.toLocaleDateString('pt-PT');
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'testemunho': return 'bg-gradient-primary text-primary-foreground';
      case 'oração': return 'bg-gradient-accent text-accent-foreground';
      case 'reflexão': return 'bg-secondary text-secondary-foreground';
      case 'prayer': return 'bg-gradient-accent text-accent-foreground';
      case 'testimony': return 'bg-gradient-primary text-primary-foreground';
      case 'general': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">A carregar posts da comunidade...</p>
        </div>
      </div>
    );
  }

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
              <h3 className="text-2xl font-bold">{posts.length}</h3>
              <p className="text-muted-foreground">Posts Totais</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">{posts.reduce((sum, post) => sum + (post.comments_count || 0), 0)}</h3>
              <p className="text-muted-foreground">Comentários</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">{posts.reduce((sum, post) => sum + (post.likes_count || 0), 0)}</h3>
              <p className="text-muted-foreground">Likes Totais</p>
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
                <div>
                  <Label htmlFor="post-category">Categoria</Label>
                  <select
                    id="post-category"
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  >
                    <option value="general">Geral</option>
                    <option value="testemunho">Testemunho</option>
                    <option value="oração">Oração</option>
                    <option value="reflexão">Reflexão</option>
                  </select>
                </div>
                <div>
                  <Label>Imagens (opcional)</Label>
                  <ImageUpload
                    onImagesUploaded={handleImagesUploaded}
                    existingImages={newPost.media_urls}
                    maxImages={5}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreatePost}>
                    <ImageIcon className="h-4 w-4 mr-2" />
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Community Posts */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {posts.length === 0 ? "Nenhum post ainda" : "Nenhum post encontrado"}
                </h3>
                <p className="text-muted-foreground">
                  {posts.length === 0 
                    ? "Seja o primeiro a partilhar algo com a comunidade!" 
                    : "Tente ajustar os termos de pesquisa."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                         <AvatarFallback>
                           {(post.author?.display_name || 
                             post.author?.email?.split('@')[0] || 
                             'U')?.charAt(0)?.toUpperCase()}
                         </AvatarFallback>
                      </Avatar>
                       <div>
                         <h3 className="font-semibold">
                           {post.author?.display_name || 
                            post.author?.email?.split('@')[0] || 
                            'Utilizador Desconhecido'}
                         </h3>
                         <p className="text-sm text-muted-foreground">{formatDate(post.created_at)}</p>
                       </div>
                    </div>
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category === 'general' ? 'Geral' : post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.content}</p>
                  
                  {/* Post Images */}
                  {post.media_urls && post.media_urls.length > 0 && (
                    <PostImages images={post.media_urls} className="mb-4" />
                  )}
                  
                  <div className="flex items-center gap-4 mb-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`text-muted-foreground ${post.user_liked ? 'text-primary' : ''}`}
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${post.user_liked ? 'fill-current' : ''}`} />
                      {post.likes_count || 0}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Share2 className="h-4 w-4 mr-1" />
                      Partilhar
                    </Button>
                  </div>

                  {/* Comments Section */}
                  <PostComments 
                    postId={post.id} 
                    commentsCount={post.comments_count || 0}
                  />
                </CardContent>
              </Card>
            ))
          )}
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