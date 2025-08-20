-- Update the INSERT policy for community_posts to work with profiles.id
DROP POLICY IF EXISTS "Utilizadores podem criar posts" ON community_posts;

CREATE POLICY "Utilizadores podem criar posts" 
ON community_posts 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = community_posts.author_id
  )
);