-- Remove the old foreign key constraint that was referencing profiles.user_id
ALTER TABLE community_posts 
DROP CONSTRAINT IF EXISTS community_posts_author_id_fkey;

-- Also remove old constraints for comments and likes if they exist
ALTER TABLE community_comments 
DROP CONSTRAINT IF EXISTS community_comments_author_id_fkey;

ALTER TABLE community_likes 
DROP CONSTRAINT IF EXISTS community_likes_user_id_fkey;