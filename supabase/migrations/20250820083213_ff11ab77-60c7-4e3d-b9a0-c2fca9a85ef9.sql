-- Create table for community post comments
CREATE TABLE public.community_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Users can view comments on visible posts" 
ON public.community_comments 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.community_posts 
  WHERE id = post_id AND (visible = true OR get_current_user_role() = 'admin')
));

CREATE POLICY "Users can create comments" 
ON public.community_comments 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors and admin can update comments" 
ON public.community_comments 
FOR UPDATE 
USING ((auth.uid() = author_id) OR (get_current_user_role() = 'admin'));

CREATE POLICY "Authors and admin can delete comments" 
ON public.community_comments 
FOR DELETE 
USING ((auth.uid() = author_id) OR (get_current_user_role() = 'admin'));

-- Create table for community post likes
CREATE TABLE public.community_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for likes
CREATE POLICY "Users can view likes on visible posts" 
ON public.community_likes 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.community_posts 
  WHERE id = post_id AND (visible = true OR get_current_user_role() = 'admin')
));

CREATE POLICY "Users can create likes" 
ON public.community_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.community_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create table for contact messages
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for contact messages
CREATE POLICY "Only admin can view contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Anyone can create contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admin can update contact messages" 
ON public.contact_messages 
FOR UPDATE 
USING (get_current_user_role() = 'admin');

-- Add trigger for comments updated_at
CREATE TRIGGER update_community_comments_updated_at
BEFORE UPDATE ON public.community_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add category column to community_posts
ALTER TABLE public.community_posts ADD COLUMN category TEXT DEFAULT 'general';

-- Add indexes for better performance
CREATE INDEX idx_community_comments_post_id ON public.community_comments(post_id);
CREATE INDEX idx_community_comments_author_id ON public.community_comments(author_id);
CREATE INDEX idx_community_likes_post_id ON public.community_likes(post_id);
CREATE INDEX idx_community_likes_user_id ON public.community_likes(user_id);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);