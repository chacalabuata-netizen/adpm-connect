import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  role: 'member' | 'admin';
  display_name?: string;
  member_status?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null
        }));

        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            const userProfile = profile ? {
              ...profile,
              role: profile.role as 'member' | 'admin'
            } : null;

            setAuthState(prev => ({
              ...prev,
              profile: userProfile,
              loading: false
            }));

            // Notify admin login if user is admin
            if (userProfile?.role === 'admin' && event === 'SIGNED_IN') {
              try {
                await supabase.functions.invoke('notify-admin-login', {
                  body: {
                    adminEmail: userProfile.email,
                    adminName: userProfile.display_name || 'Admin',
                    loginTime: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                  }
                });
              } catch (error) {
                console.log('Admin notification failed:', error);
              }
            }
          }, 0);
        } else {
          setAuthState(prev => ({
            ...prev,
            profile: null,
            loading: false
          }));
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null
      }));

      if (session?.user) {
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          setAuthState(prev => ({
            ...prev,
            profile: profile ? {
              ...profile,
              role: profile.role as 'member' | 'admin'
            } : null,
            loading: false
          }));
        }, 0);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string, memberStatus: string = 'visitante') => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName,
          member_status: memberStatus
        }
      }
    });

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { data, error };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // Reset auth state immediately regardless of error
      setAuthState({
        user: null,
        session: null,
        profile: null,
        loading: false
      });
      
      // Force page reload to clear any cached state
      window.location.href = '/';
      
      return { error };
    } catch (error) {
      // Reset state even on error
      setAuthState({
        user: null,
        session: null,
        profile: null,
        loading: false
      });
      window.location.href = '/';
      return { error };
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    isAdmin: authState.profile?.role === 'admin',
    isMember: authState.profile?.role === 'member'
  };
}