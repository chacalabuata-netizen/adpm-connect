import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Activity {
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

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('visible', true)
        .order('day_of_week', { ascending: true })
        .order('time_start', { ascending: true });

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar atividades",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatActivityTime = (timeStart: string, timeEnd?: string) => {
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
    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    fetchActivities,
    formatActivityTime,
    getDayName,
    DAYS_OF_WEEK
  };
}