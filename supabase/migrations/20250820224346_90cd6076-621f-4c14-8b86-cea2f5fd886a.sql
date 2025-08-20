-- Update UPDATE policy for community_posts
DROP POLICY IF EXISTS "Autores podem editar próprios posts" ON community_posts;

CREATE POLICY "Autores podem editar próprios posts" 
ON community_posts 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = community_posts.author_id
  ) OR get_current_user_role() = 'admin'
);

-- Update DELETE policy for community_posts  
DROP POLICY IF EXISTS "Autores e admin podem eliminar posts" ON community_posts;

CREATE POLICY "Autores e admin podem eliminar posts" 
ON community_posts 
FOR DELETE 
USING (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = community_posts.author_id
  ) OR get_current_user_role() = 'admin'
);

-- Update INSERT policy for community_comments
DROP POLICY IF EXISTS "Users can create comments" ON community_comments;

CREATE POLICY "Users can create comments" 
ON community_comments 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = community_comments.author_id
  )
);

-- Update UPDATE policy for community_comments
DROP POLICY IF EXISTS "Authors and admin can update comments" ON community_comments;

CREATE POLICY "Authors and admin can update comments" 
ON community_comments 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = community_comments.author_id
  ) OR get_current_user_role() = 'admin'
);

-- Update DELETE policy for community_comments
DROP POLICY IF EXISTS "Authors and admin can delete comments" ON community_comments;

CREATE POLICY "Authors and admin can delete comments" 
ON community_comments 
FOR DELETE 
USING (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = community_comments.author_id
  ) OR get_current_user_role() = 'admin'
);

-- Update INSERT policy for community_likes  
DROP POLICY IF EXISTS "Users can create likes" ON community_likes;

CREATE POLICY "Users can create likes" 
ON community_likes 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = community_likes.user_id
  )
);

-- Update DELETE policy for community_likes
DROP POLICY IF EXISTS "Users can delete their own likes" ON community_likes;

CREATE POLICY "Users can delete their own likes" 
ON community_likes 
FOR DELETE 
USING (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE id = community_likes.user_id
  )
);