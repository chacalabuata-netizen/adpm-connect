import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  visible: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar anúncios",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([announcement])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Anúncio criado",
        description: "O anúncio foi publicado com sucesso."
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar anúncio",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Anúncio atualizado",
        description: "As alterações foram guardadas."
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar anúncio",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Anúncio eliminado",
        description: "O anúncio foi removido com sucesso."
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao eliminar anúncio",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    loading,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  };
}