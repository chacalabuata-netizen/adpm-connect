import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CommunityContent {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  media_urls: string[] | null;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useCommunityContent = () => {
  const [contents, setContents] = useState<CommunityContent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Erro ao buscar conteúdo:', error);
      toast.error('Erro ao carregar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  const createContent = async (contentData: {
    title: string;
    description?: string;
    content?: string;
    media_urls?: string[];
    created_by: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('community_content')
        .insert(contentData)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Conteúdo criado com sucesso!');
      fetchContents();
      return data;
    } catch (error) {
      console.error('Erro ao criar conteúdo:', error);
      toast.error('Erro ao criar conteúdo');
      throw error;
    }
  };

  const updateContent = async (id: string, updates: Partial<CommunityContent>) => {
    try {
      const { error } = await supabase
        .from('community_content')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Conteúdo atualizado com sucesso!');
      fetchContents();
    } catch (error) {
      console.error('Erro ao atualizar conteúdo:', error);
      toast.error('Erro ao atualizar conteúdo');
      throw error;
    }
  };

  const deleteContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('community_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Conteúdo eliminado com sucesso!');
      fetchContents();
    } catch (error) {
      console.error('Erro ao eliminar conteúdo:', error);
      toast.error('Erro ao eliminar conteúdo');
      throw error;
    }
  };

  const publishToCommunity = async (contentId: string, userId: string) => {
    try {
      const content = contents.find(c => c.id === contentId);
      if (!content) throw new Error('Conteúdo não encontrado');

      // Get the profile ID for the user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        toast.error('Erro: Perfil do utilizador não encontrado');
        throw profileError;
      }

      if (!profile) {
        toast.error('Erro: Perfil do utilizador não encontrado');
        throw new Error('Profile not found');
      }

      // Create community post using profile ID
      const { error: postError } = await supabase
        .from('community_posts')
        .insert({
          title: content.title,
          content: `${content.description || ''}\n\n${content.content || ''}`,
          category: 'anuncio',
          author_id: profile.id,
          media_urls: content.media_urls
        });

      if (postError) {
        console.error('Erro ao criar post:', postError);
        throw postError;
      }

      // Update content status
      await updateContent(contentId, { status: 'published' });
      
      toast.success('Conteúdo publicado na comunidade!');
    } catch (error) {
      console.error('Erro ao publicar:', error);
      toast.error('Erro ao publicar conteúdo');
      throw error;
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  return {
    contents,
    loading,
    createContent,
    updateContent,
    deleteContent,
    publishToCommunity,
    refreshContents: fetchContents
  };
};