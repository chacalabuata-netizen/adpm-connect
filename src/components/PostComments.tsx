import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useCommunity, type CommunityComment } from '@/hooks/useCommunity';

interface PostCommentsProps {
  postId: string;
  commentsCount: number;
}

export const PostComments: React.FC<PostCommentsProps> = ({ postId, commentsCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { addComment, getPostComments } = useCommunity();

  const loadComments = async () => {
    if (!isExpanded) return;
    
    setLoading(true);
    try {
      const fetchedComments = await getPostComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [isExpanded, postId]);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      await addComment(postId, newComment.trim());
      setNewComment('');
      // Reload comments to show the new one
      await loadComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'há alguns minutos';
    if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays === 1) return 'há 1 dia';
    if (diffDays < 7) return `há ${diffDays} dias`;
    return date.toLocaleDateString('pt-PT');
  };

  return (
    <div className="space-y-3">
      {/* Comments Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleExpanded}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <MessageSquare className="h-4 w-4 mr-1" />
        {commentsCount > 0 ? (
          <>
            {commentsCount} comentário{commentsCount > 1 ? 's' : ''}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </>
        ) : (
          'Comentar'
        )}
      </Button>

      {/* Comments Section */}
      {isExpanded && (
        <div className="space-y-4 border-t pt-4">
          {/* New Comment Form */}
          <div className="space-y-3">
            <Textarea
              placeholder="Escreva o seu comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                size="sm"
              >
                <Send className="h-4 w-4 mr-2" />
                {submitting ? 'A enviar...' : 'Comentar'}
              </Button>
            </div>
          </div>

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">A carregar comentários...</p>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {comment.author?.display_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-sm font-medium">
                             {comment.author?.display_name || 
                              comment.author?.email?.split('@')[0] || 
                              'Utilizador Desconhecido'}
                           </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Seja o primeiro a comentar!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};