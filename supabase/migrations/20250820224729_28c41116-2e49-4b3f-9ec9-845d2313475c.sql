-- Add foreign key constraints (will only add if they don't exist)
DO $$
BEGIN
    -- Add constraint for community_comments if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_community_comments_author' 
        AND table_name = 'community_comments'
    ) THEN
        ALTER TABLE community_comments 
        ADD CONSTRAINT fk_community_comments_author 
        FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;

    -- Add constraint for community_likes if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_community_likes_user' 
        AND table_name = 'community_likes'
    ) THEN
        ALTER TABLE community_likes 
        ADD CONSTRAINT fk_community_likes_user 
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
END
$$;