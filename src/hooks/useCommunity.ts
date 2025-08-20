import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
  media_urls?: string[];
  author?: {
    display_name: string;
    email: string;
  };
  comments_count?: number;
  likes_count?: number;
  user_liked?: boolean;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: {
    display_name: string;
    email: string;
  };
}

export const useCommunity = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles:author_id (
            display_name,
            email
          )
        `)
        .eq('visible', true)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Fetch comments count, likes count and user likes for each post
      const user = (await supabase.auth.getUser()).data.user;
      const postsWithCounts = await Promise.all(
        (postsData || []).map(async (post) => {
          // Get comments count
          const { count: commentsCount } = await supabase
            .from('community_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Get likes count
          const { count: likesCount } = await supabase
            .from('community_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // Check if user liked this post
          let userLiked = false;
          if (user) {
            const { data: likeData } = await supabase
              .from('community_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single();
            userLiked = !!likeData;
          }

          return {
            ...post,
            author: post.profiles,
            comments_count: commentsCount || 0,
            likes_count: likesCount || 0,
            user_liked: userLiked,
          };
        })
      );

      setPosts(postsWithCounts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os posts da comunidade",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createPost = async (postData: { title: string; content: string; category?: string; media_urls?: string[] }) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('community_posts')
        .insert([
          {
            title: postData.title,
            content: postData.content,
            category: postData.category || 'general',
            author_id: user.id,
            media_urls: postData.media_urls || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Post criado com sucesso!",
      });

      fetchPosts(); // Refresh posts
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o post",
        variant: "destructive",
      });
      throw error;
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from('community_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Remove like
        const { error } = await supabase
          .from('community_likes')
          .delete()
          .eq('id', existingLike.id);

        if (error) throw error;
      } else {
        // Add like
        const { error } = await supabase
          .from('community_likes')
          .insert([{ post_id: postId, user_id: user.id }]);

        if (error) throw error;
      }

      fetchPosts(); // Refresh posts to update like counts
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o gosto",
        variant: "destructive",
      });
    }
  };

  const addComment = async (postId: string, content: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('community_comments')
        .insert([
          {
            post_id: postId,
            author_id: user.id,
            content,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Comentário adicionado!",
      });

      fetchPosts(); // Refresh posts to update comment counts
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getPostComments = async (postId: string): Promise<CommunityComment[]> => {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select(`
          *,
          profiles:author_id (
            display_name,
            email
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(comment => ({
        ...comment,
        author: Array.isArray(comment.profiles) && comment.profiles.length > 0 
          ? comment.profiles[0] 
          : comment.profiles && typeof comment.profiles === 'object' 
          ? comment.profiles 
          : undefined,
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchPosts();

    // Set up real-time subscriptions
    const postsChannel = supabase
      .channel('community_posts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        fetchPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_likes' }, () => {
        fetchPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_comments' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, [fetchPosts]);

  const updatePost = async (postId: string, updates: { title?: string; content?: string; category?: string }) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update(updates)
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Post atualizado com sucesso!",
      });

      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o post",
        variant: "destructive",
      });
      throw error;
    }
  };

  const togglePostVisibility = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');

      const { error } = await supabase
        .from('community_posts')
        .update({ visible: !post.visible })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Post ${post.visible ? 'ocultado' : 'publicado'} com sucesso!`,
      });

      fetchPosts();
    } catch (error) {
      console.error('Error toggling post visibility:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar a visibilidade do post",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Post eliminado com sucesso!",
      });

      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível eliminar o post",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    posts,
    loading,
    createPost,
    updatePost,
    togglePostVisibility,
    deletePost,
    toggleLike,
    addComment,
    getPostComments,
    refreshPosts: fetchPosts,
  };
};