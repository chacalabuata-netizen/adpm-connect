import { useState } from 'react';
import { useCommunity } from '@/hooks/useCommunity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit, Eye, EyeOff, Trash2, MessageSquare, Heart, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const AdminCommunity = () => {
  const { posts, loading, refreshPosts, updatePost, togglePostVisibility, deletePost } = useCommunity();
  const { toast } = useToast();
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const handleEditPost = (post: any) => {
    setEditingPost(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
  };

  const handleSaveEdit = async () => {
    if (!editingPost) return;
    
    try {
      await updatePost(editingPost, {
        title: editTitle,
        content: editContent,
        category: editCategory
      });
      setEditingPost(null);
    } catch (error) {
      // Error already handled in updatePost
    }
  };

  const handleToggleVisibility = async (postId: string) => {
    try {
      await togglePostVisibility(postId);
    } catch (error) {
      // Error already handled in togglePostVisibility
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('Tem certeza que deseja eliminar este post?')) {
      try {
        await deletePost(postId);
      } catch (error) {
        // Error already handled in deletePost
      }
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'geral': 'bg-muted',
      'oração': 'bg-primary/10 text-primary',
      'estudo': 'bg-accent/10 text-accent-foreground',
      'evento': 'bg-secondary/10 text-secondary-foreground',
      'testemunho': 'bg-primary/20 text-primary'
    };
    return colors[category as keyof typeof colors] || 'bg-muted';
  };

  const totalPosts = posts.length;
  const visiblePosts = posts.filter(post => post.visible).length;
  const hiddenPosts = totalPosts - visiblePosts;
  const totalComments = posts.reduce((sum, post) => sum + (post.comments_count || 0), 0);
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes_count || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão da Comunidade</h1>
        <Button onClick={refreshPosts} variant="outline">
          Atualizar
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Posts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Visíveis</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{visiblePosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts Ocultos</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{hiddenPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comentários</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className={`${!post.visible ? 'opacity-60 border-orange-200' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <Badge variant="outline" className={getCategoryColor(post.category)}>
                      {post.category}
                    </Badge>
                    {!post.visible && (
                      <Badge variant="destructive">Oculto</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Por {post.author?.display_name || 'Utilizador'} • {formatDate(post.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPost(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Editar Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-title">Título</Label>
                          <Input
                            id="edit-title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-category">Categoria</Label>
                          <Select value={editCategory} onValueChange={setEditCategory}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="geral">Geral</SelectItem>
                              <SelectItem value="oração">Oração</SelectItem>
                              <SelectItem value="estudo">Estudo Bíblico</SelectItem>
                              <SelectItem value="evento">Evento</SelectItem>
                              <SelectItem value="testemunho">Testemunho</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="edit-content">Conteúdo</Label>
                          <Textarea
                            id="edit-content"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={6}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button onClick={handleSaveEdit}>
                            Salvar Alterações
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleVisibility(post.id)}
                  >
                    {post.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {post.likes_count || 0} likes
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {post.comments_count || 0} comentários
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum post encontrado na comunidade.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};