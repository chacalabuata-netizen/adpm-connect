-- Create community_content table for admin content management
CREATE TABLE public.community_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  media_urls TEXT[], -- Array of uploaded file URLs
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.community_content ENABLE ROW LEVEL SECURITY;

-- Create policies for community_content
CREATE POLICY "Only admin can manage community content" 
ON public.community_content 
FOR ALL 
USING (get_current_user_role() = 'admin');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_community_content_updated_at
BEFORE UPDATE ON public.community_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();