import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Schedule {
  id: string;
  title: string;
  description?: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  time_start: string;
  time_end?: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

const DAYS_OF_WEEK = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado'
];

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('visible', true)
        .order('day_of_week', { ascending: true })
        .order('time_start', { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar horários",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (schedule: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .insert([schedule]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Horário criado com sucesso",
      });
      
      await fetchSchedules();
    } catch (error: any) {
      toast({
        title: "Erro ao criar horário",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateSchedule = async (id: string, updates: Partial<Schedule>) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Horário atualizado com sucesso",
      });
      
      await fetchSchedules();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar horário",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Horário eliminado com sucesso",
      });
      
      await fetchSchedules();
    } catch (error: any) {
      toast({
        title: "Erro ao eliminar horário",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const formatScheduleTime = (timeStart: string, timeEnd?: string) => {
    const start = timeStart.substring(0, 5); // Remove seconds
    if (timeEnd) {
      const end = timeEnd.substring(0, 5);
      return `${start} - ${end}`;
    }
    return start;
  };

  const getDayName = (dayOfWeek: number) => {
    return DAYS_OF_WEEK[dayOfWeek] || 'Desconhecido';
  };

  useEffect(() => {
    fetchSchedules();

    // Set up real-time subscription
    const channel = supabase
      .channel('schedules_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, () => {
        fetchSchedules();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    schedules,
    loading,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    formatScheduleTime,
    getDayName,
    DAYS_OF_WEEK
  };
}