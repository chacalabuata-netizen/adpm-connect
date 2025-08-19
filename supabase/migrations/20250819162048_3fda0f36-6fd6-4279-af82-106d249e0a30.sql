-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT true,
  author_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  time_start TIME NOT NULL,
  time_end TIME,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create schedules table for cult schedules
CREATE TABLE public.schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  time_start TIME NOT NULL,
  time_end TIME,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community_posts table
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for church images
INSERT INTO storage.buckets (id, name, public) VALUES ('church-images', 'church-images', true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON public.schedules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Security definer function to get user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles RLS policies
CREATE POLICY "Cada utilizador vê apenas o próprio perfil"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Cada utilizador edita apenas o próprio perfil"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Announcements RLS policies
CREATE POLICY "Todos podem ver anúncios"
ON public.announcements FOR SELECT
USING (true);

CREATE POLICY "Só admin pode criar anúncios"
ON public.announcements FOR INSERT
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Só admin pode atualizar anúncios"
ON public.announcements FOR UPDATE
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Só admin pode eliminar anúncios"
ON public.announcements FOR DELETE
USING (public.get_current_user_role() = 'admin');

-- Activities RLS policies (admins manage, all can read)
CREATE POLICY "Todos podem ver atividades"
ON public.activities FOR SELECT
USING (visible = true OR public.get_current_user_role() = 'admin');

CREATE POLICY "Só admin pode gerir atividades"
ON public.activities FOR ALL
USING (public.get_current_user_role() = 'admin');

-- Schedules RLS policies (admins manage, all can read)
CREATE POLICY "Todos podem ver horários"
ON public.schedules FOR SELECT
USING (visible = true OR public.get_current_user_role() = 'admin');

CREATE POLICY "Só admin pode gerir horários"
ON public.schedules FOR ALL
USING (public.get_current_user_role() = 'admin');

-- Community posts RLS policies
CREATE POLICY "Todos podem ver posts da comunidade"
ON public.community_posts FOR SELECT
USING (visible = true OR public.get_current_user_role() = 'admin');

CREATE POLICY "Utilizadores podem criar posts"
ON public.community_posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Autores podem editar próprios posts"
ON public.community_posts FOR UPDATE
USING (auth.uid() = author_id OR public.get_current_user_role() = 'admin');

CREATE POLICY "Autores e admin podem eliminar posts"
ON public.community_posts FOR DELETE
USING (auth.uid() = author_id OR public.get_current_user_role() = 'admin');

-- Storage policies for church images
CREATE POLICY "Todos podem ver imagens da igreja"
ON storage.objects FOR SELECT
USING (bucket_id = 'church-images');

CREATE POLICY "Só admin pode fazer upload de imagens"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'church-images' AND public.get_current_user_role() = 'admin');

CREATE POLICY "Só admin pode atualizar imagens"
ON storage.objects FOR UPDATE
USING (bucket_id = 'church-images' AND public.get_current_user_role() = 'admin');

CREATE POLICY "Só admin pode eliminar imagens"
ON storage.objects FOR DELETE
USING (bucket_id = 'church-images' AND public.get_current_user_role() = 'admin');

-- Insert some initial data for schedules
INSERT INTO public.schedules (title, description, day_of_week, time_start, time_end) VALUES
('Culto Dominical', 'Culto principal da semana com pregação, louvor e comunhão', 0, '10:00', '12:00'),
('Estudo Bíblico', 'Estudo aprofundado da Palavra de Deus', 3, '20:00', '21:30'),
('Oração e Jejum', 'Momento de oração e busca pela presença de Deus', 5, '20:00', '21:00');

-- Insert some initial activities
INSERT INTO public.activities (title, description, day_of_week, time_start, time_end) VALUES
('Juventude', 'Reunião dos jovens para fellowship e crescimento espiritual', 6, '19:00', '20:30'),
('Ministério de Mulheres', 'Encontro das mulheres para partilha e oração', 2, '19:30', '21:00'),
('Ministério de Homens', 'Reunião dos homens para crescimento e compromisso', 4, '19:30', '21:00'),
('Escola Dominical', 'Ensino bíblico para todas as idades', 0, '09:00', '09:45');