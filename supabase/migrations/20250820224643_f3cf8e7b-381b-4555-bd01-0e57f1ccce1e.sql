-- Add foreign key constraint for community_comments if it doesn't exist
ALTER TABLE community_comments 
ADD CONSTRAINT IF NOT EXISTS fk_community_comments_author 
FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint for community_likes if it doesn't exist  
ALTER TABLE community_likes 
ADD CONSTRAINT IF NOT EXISTS fk_community_likes_user 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;