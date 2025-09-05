import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RadioProgram {
  id: string;
  title: string;
  description?: string;
  host_name?: string;
  day_of_week: number;
  time_start: string;
  time_end?: string;
  duration_minutes?: number;
  category: string;
  visible: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export function useRadioPrograms() {
  const [programs, setPrograms] = useState<RadioProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('radio_programs')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('time_start', { ascending: true });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar programas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createProgram = async (program: Omit<RadioProgram, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('radio_programs')
        .insert([program])
        .select()
        .single();

      if (error) throw error;

      setPrograms(prev => [...prev, data].sort((a, b) => 
        a.day_of_week === b.day_of_week 
          ? a.time_start.localeCompare(b.time_start)
          : a.day_of_week - b.day_of_week
      ));

      toast({
        title: "Programa criado",
        description: "O programa foi adicionado com sucesso."
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar programa",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const updateProgram = async (id: string, updates: Partial<RadioProgram>) => {
    try {
      const { data, error } = await supabase
        .from('radio_programs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPrograms(prev => 
        prev.map(program => 
          program.id === id ? { ...program, ...data } : program
        ).sort((a, b) => 
          a.day_of_week === b.day_of_week 
            ? a.time_start.localeCompare(b.time_start)
            : a.day_of_week - b.day_of_week
        )
      );

      toast({
        title: "Programa atualizado",
        description: "As alterações foram guardadas."
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar programa",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const deleteProgram = async (id: string) => {
    try {
      const { error } = await supabase
        .from('radio_programs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPrograms(prev => prev.filter(program => program.id !== id));

      toast({
        title: "Programa eliminado",
        description: "O programa foi removido com sucesso."
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao eliminar programa",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return {
    programs,
    loading,
    fetchPrograms,
    createProgram,
    updateProgram,
    deleteProgram
  };
}