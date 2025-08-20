-- Adicionar campo de status para membros
ALTER TABLE public.profiles 
ADD COLUMN member_status TEXT DEFAULT 'visitante' CHECK (member_status IN ('membro_batizado', 'visitante'));

-- Adicionar índice para melhorar performance
CREATE INDEX idx_profiles_member_status ON public.profiles(member_status);