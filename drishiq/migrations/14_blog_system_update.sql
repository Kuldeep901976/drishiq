-- Update blog_posts table with missing columns
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS publish_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS read_time TEXT,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS topics TEXT[],
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add comment to explain the columns
COMMENT ON TABLE blog_posts IS 'Stores blog posts with metadata';
COMMENT ON COLUMN blog_posts.publish_date IS 'When the post was/will be published';
COMMENT ON COLUMN blog_posts.read_time IS 'Estimated reading time (e.g., "5 min")';
COMMENT ON COLUMN blog_posts.excerpt IS 'Short summary of the post';
COMMENT ON COLUMN blog_posts.topics IS 'Array of topic tags';
COMMENT ON COLUMN blog_posts.category IS 'Main category of the post';
COMMENT ON COLUMN blog_posts.author IS 'Author of the post';
COMMENT ON COLUMN blog_posts.status IS 'Post status (draft/published)';
COMMENT ON COLUMN blog_posts.seo_title IS 'SEO-optimized title';
COMMENT ON COLUMN blog_posts.seo_description IS 'SEO meta description';
COMMENT ON COLUMN blog_posts.tags IS 'Array of general tags'; 