-- First, let's clean up orphaned data without adding constraints yet

-- Delete posts without corresponding profiles
DELETE FROM community_posts 
WHERE author_id NOT IN (SELECT id FROM profiles);

-- Delete comments without corresponding profiles  
DELETE FROM community_comments 
WHERE author_id NOT IN (SELECT id FROM profiles);

-- Delete likes without corresponding profiles
DELETE FROM community_likes 
WHERE user_id NOT IN (SELECT id FROM profiles);

-- Now add the foreign key constraints
ALTER TABLE community_posts 
ADD CONSTRAINT fk_community_posts_author 
FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE community_comments 
ADD CONSTRAINT fk_community_comments_author 
FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE community_likes 
ADD CONSTRAINT fk_community_likes_user 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;