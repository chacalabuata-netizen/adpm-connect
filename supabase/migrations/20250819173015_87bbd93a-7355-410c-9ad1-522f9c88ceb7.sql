-- Atualizar o role do utilizador para admin
-- Vou definir o mmariopack@gmail.com como admin
UPDATE public.profiles 
SET role = 'admin', updated_at = now()
WHERE email = 'mmariopack@gmail.com';