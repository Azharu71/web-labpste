-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.daftar_praktikan (
id uuid NOT NULL DEFAULT gen_random_uuid(),
user_id uuid NOT NULL,
praktikum_id text NOT NULL,
full_name text NOT NULL,
nim text NOT NULL,
krs_type text CHECK (krs_type = ANY (ARRAY['manual'::text, 'regular'::text])),
krs_url text,
group_id uuid,
created_at timestamp with time zone DEFAULT now(),
ipk text,
CONSTRAINT daftar_praktikan_pkey PRIMARY KEY (id),
CONSTRAINT practicum_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
CONSTRAINT daftar_praktikan_praktikum_id_fkey FOREIGN KEY (praktikum_id) REFERENCES public.list_praktikum(id)
);
CREATE TABLE public.jadwal_kosong (
id uuid NOT NULL,
senin text,
selasa text,
rabu text,
kamis text,
jumat text,
sabtu text,
CONSTRAINT jadwal_kosong_pkey PRIMARY KEY (id),
CONSTRAINT jadwal_praktikan_id_fkey FOREIGN KEY (id) REFERENCES public.daftar_praktikan(id)
);
CREATE TABLE public.list_praktikum (
id character varying NOT NULL,
nama_praktikum text NOT NULL,
nama_lab text NOT NULL,
semester text NOT NULL,
tahun text,
CONSTRAINT list_praktikum_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
id uuid NOT NULL,
nim character varying NOT NULL UNIQUE CHECK (char_length(nim::text) >= 3),
role_id integer NOT NULL,
CONSTRAINT profiles_pkey PRIMARY KEY (id),
CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
CONSTRAINT profiles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id)
);
CREATE TABLE public.roles (
id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
name character varying NOT NULL UNIQUE,
CONSTRAINT roles_pkey PRIMARY KEY (id)
);
