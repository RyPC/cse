CREATE TABLE IF NOT EXISTS public.classes
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    title VARCHAR(256) NOT NULL,
    description TEXT,
    location VARCHAR(256) NOT NULL,
    capacity INT NOT NULL,
    level character varying(16) COLLATE pg_catalog."default" NOT NULL,
    costume TEXT NOT NULL,
    CONSTRAINT class_pkey PRIMARY KEY (id),
    CONSTRAINT level_check CHECK (level::text = ANY (ARRAY['beginner'::character varying, 'intermediate'::character varying, 'advanced'::character varying]::text[]))
)

