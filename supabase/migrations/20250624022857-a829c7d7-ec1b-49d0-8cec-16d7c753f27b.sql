
-- Criar bucket para imagens de eventos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
);

-- Criar políticas permissivas para o bucket
CREATE POLICY "Allow public read access on event images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

CREATE POLICY "Allow authenticated users to upload event images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'event-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their event images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'event-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to delete their event images"
ON storage.objects FOR DELETE
USING (bucket_id = 'event-images' AND auth.role() = 'authenticated');

-- Criar tabela para lista de presentes
CREATE TABLE public.leju_gift_lists (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.leju_events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Lista de Presentes',
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para itens da lista de presentes
CREATE TABLE public.leju_gift_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_list_id uuid REFERENCES public.leju_gift_lists(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  price numeric(10,2),
  image_url text,
  quantity integer NOT NULL DEFAULT 1,
  purchased_quantity integer NOT NULL DEFAULT 0,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para registro de presentes escolhidos
CREATE TABLE public.leju_gift_selections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_item_id uuid REFERENCES public.leju_gift_items(id) ON DELETE CASCADE NOT NULL,
  guest_name text NOT NULL,
  guest_email text,
  guest_phone text,
  quantity integer NOT NULL DEFAULT 1,
  message text,
  selected_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.leju_gift_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leju_gift_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leju_gift_selections ENABLE ROW LEVEL SECURITY;

-- Políticas para lista de presentes (proprietários podem gerenciar, público pode ver se ativa)
CREATE POLICY "Users can manage their gift lists"
ON public.leju_gift_lists
FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Public can view active gift lists"
ON public.leju_gift_lists
FOR SELECT
USING (is_active = true);

-- Políticas para itens (proprietários gerenciam, público vê se lista ativa)
CREATE POLICY "Users can manage their gift items"
ON public.leju_gift_items
FOR ALL
USING (
  gift_list_id IN (
    SELECT id FROM public.leju_gift_lists 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Public can view items from active gift lists"
ON public.leju_gift_items
FOR SELECT
USING (
  gift_list_id IN (
    SELECT id FROM public.leju_gift_lists 
    WHERE is_active = true
  )
);

-- Políticas para seleções (qualquer um pode selecionar, proprietários podem ver)
CREATE POLICY "Anyone can select gifts"
ON public.leju_gift_selections
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Gift list owners can view selections"
ON public.leju_gift_selections
FOR SELECT
USING (
  gift_item_id IN (
    SELECT gi.id FROM public.leju_gift_items gi
    JOIN public.leju_gift_lists gl ON gi.gift_list_id = gl.id
    WHERE gl.user_id = auth.uid()
  )
);

CREATE POLICY "Public can view their own selections"
ON public.leju_gift_selections
FOR SELECT
USING (true);
