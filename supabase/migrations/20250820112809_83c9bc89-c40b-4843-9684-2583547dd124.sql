-- Ensure only the specific admin email can have admin role
ALTER TABLE public.profiles 
ADD CONSTRAINT admin_email_restriction 
CHECK (
  role != 'admin' OR 
  (role = 'admin' AND email = 'mmariopack@gmail.com')
);

-- Update existing admin restrictions
UPDATE public.profiles 
SET role = 'member' 
WHERE role = 'admin' AND email != 'mmariopack@gmail.com';