import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AppStats {
  totalUsers: number;
  totalAnnouncements: number;
  activeSchedules: number;
  totalActivities: number;
  totalPosts: number;
  unreadMessages: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<AppStats>({
    totalUsers: 0,
    totalAnnouncements: 0,
    activeSchedules: 0,
    totalActivities: 0,
    totalPosts: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);

      // Get all stats in parallel
      const [
        usersResult,
        announcementsResult,
        schedulesResult,
        activitiesResult,
        postsResult,
        messagesResult,
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('announcements').select('*', { count: 'exact', head: true }).eq('visible', true),
        supabase.from('schedules').select('*', { count: 'exact', head: true }).eq('visible', true),
        supabase.from('activities').select('*', { count: 'exact', head: true }).eq('visible', true),
        supabase.from('community_posts').select('*', { count: 'exact', head: true }).eq('visible', true),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).is('read_at', null),
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalAnnouncements: announcementsResult.count || 0,
        activeSchedules: schedulesResult.count || 0,
        totalActivities: activitiesResult.count || 0,
        totalPosts: postsResult.count || 0,
        unreadMessages: messagesResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Set up real-time subscriptions for stats updates
    const channel = supabase
      .channel('stats_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStats]);

  return {
    stats,
    loading,
    refreshStats: fetchStats,
  };
};