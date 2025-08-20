import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  user_id?: string;
  read_at?: string;
  created_at: string;
}

export const useContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createMessage = async (messageData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            ...messageData,
            user_id: user?.id || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Mensagem enviada com sucesso!",
      });

      return data;
    } catch (error) {
      console.error('Error creating message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
      throw error;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;

      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar como lida",
        variant: "destructive",
      });
    }
  };

  const getUnreadCount = () => {
    return messages.filter(message => !message.read_at).length;
  };

  useEffect(() => {
    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('contact_messages_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages]);

  return {
    messages,
    loading,
    createMessage,
    markAsRead,
    getUnreadCount,
    refreshMessages: fetchMessages,
  };
};