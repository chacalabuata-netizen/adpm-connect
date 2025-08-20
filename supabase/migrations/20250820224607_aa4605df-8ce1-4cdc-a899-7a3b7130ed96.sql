-- Remove any remaining old foreign key constraint that's causing ambiguity
ALTER TABLE community_posts 
DROP CONSTRAINT IF EXISTS community_posts_author_id_fkey;