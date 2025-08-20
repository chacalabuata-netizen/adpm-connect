-- Fix orphaned posts by updating author_id to match profiles.id
UPDATE community_posts 
SET author_id = profiles.id
FROM profiles 
WHERE community_posts.author_id = profiles.user_id;

-- Delete any posts that still don't have a matching profile
DELETE FROM community_posts 
WHERE author_id NOT IN (SELECT id FROM profiles);

-- Add foreign key constraint to prevent future orphaned posts
ALTER TABLE community_posts 
ADD CONSTRAINT fk_community_posts_author 
FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint for comments as well
ALTER TABLE community_comments 
ADD CONSTRAINT fk_community_comments_author 
FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update comments to use profiles.id as well
UPDATE community_comments 
SET author_id = profiles.id
FROM profiles 
WHERE community_comments.author_id = profiles.user_id;

-- Delete orphaned comments
DELETE FROM community_comments 
WHERE author_id NOT IN (SELECT id FROM profiles);

-- Add foreign key constraint for likes
ALTER TABLE community_likes 
ADD CONSTRAINT fk_community_likes_user 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update likes to use profiles.id
UPDATE community_likes 
SET user_id = profiles.id
FROM profiles 
WHERE community_likes.user_id = profiles.user_id;

-- Delete orphaned likes
DELETE FROM community_likes 
WHERE user_id NOT IN (SELECT id FROM profiles);