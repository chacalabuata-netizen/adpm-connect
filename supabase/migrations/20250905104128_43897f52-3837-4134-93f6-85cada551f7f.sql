-- Create radio programs table
CREATE TABLE public.radio_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  host_name TEXT,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
  time_start TIME NOT NULL,
  time_end TIME,
  duration_minutes INTEGER,
  category TEXT DEFAULT 'general',
  visible BOOLEAN NOT NULL DEFAULT true,
  author_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.radio_programs ENABLE ROW LEVEL SECURITY;

-- Create policies for radio programs
CREATE POLICY "Admin can manage radio programs" 
ON public.radio_programs 
FOR ALL 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Everyone can view visible radio programs" 
ON public.radio_programs 
FOR SELECT 
USING ((visible = true) OR (get_current_user_role() = 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_radio_programs_updated_at
BEFORE UPDATE ON public.radio_programs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();