-- Add file_type column to Course_Materials table
-- This column will store the type of file: 'document', 'pdf', 'image', '3d_model', 'archive'
ALTER TABLE Course_Materials
ADD COLUMN file_type VARCHAR(20) DEFAULT 'document'
AFTER url;
-- Update existing records to have proper file types based on URL
UPDATE Course_Materials
SET file_type = CASE
        WHEN url LIKE '%.glb'
        OR url LIKE '%.gltf' THEN '3d_model'
        WHEN url LIKE '%.pdf' THEN 'pdf'
        WHEN url LIKE '%.jpg'
        OR url LIKE '%.jpeg'
        OR url LIKE '%.png'
        OR url LIKE '%.gif' THEN 'image'
        WHEN url LIKE '%.zip' THEN 'archive'
        ELSE 'document'
    END;
-- Verify the changes
SELECT material_id,
    title,
    url,
    file_type
FROM Course_Materials
LIMIT 10;