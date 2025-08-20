-- Add media_urls column to community_posts table
ALTER TABLE public.community_posts 
ADD COLUMN media_urls TEXT[];

-- Add index for better performance when filtering posts with media
CREATE INDEX idx_community_posts_media ON public.community_posts USING GIN(media_urls);

-- Update the updated_at trigger to include the new column
-- (The trigger already exists and will automatically handle the new column)