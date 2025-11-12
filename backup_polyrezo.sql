--
-- PostgreSQL database dump
--

\restrict fjpYXZjk3fajk0anpkFEedVfUOBzzybNkrpE1J06eaGmFf6Wmq5s5R1apdIEwjh

-- Dumped from database version 18.0 (Debian 18.0-1.pgdg13+3)
-- Dumped by pg_dump version 18.0 (Debian 18.0-1.pgdg13+3)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: request_status; Type: TYPE; Schema: public; Owner: polyrezo_user
--

CREATE TYPE public.request_status AS ENUM (
    'requested',
    'accepted',
    'declined'
);


ALTER TYPE public.request_status OWNER TO polyrezo_user;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: polyrezo_user
--

CREATE TYPE public.user_role AS ENUM (
    'member',
    'admin'
);


ALTER TYPE public.user_role OWNER TO polyrezo_user;

--
-- Name: enforce_accommodation_capacity(); Type: FUNCTION; Schema: public; Owner: polyrezo_user
--

CREATE FUNCTION public.enforce_accommodation_capacity() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF (NEW.status = 'accepted') THEN
    PERFORM 1 FROM accommodations a
    WHERE a.id = NEW.accommodation_id
      AND (SELECT count(*) FROM accommodation_guests g
           WHERE g.accommodation_id = NEW.accommodation_id AND g.status='accepted')
          >= a.capacity;
    IF FOUND THEN
      RAISE EXCEPTION 'Capacity exceeded for accommodation %', NEW.accommodation_id;
    END IF;
  END IF;
  RETURN NEW;
END$$;


ALTER FUNCTION public.enforce_accommodation_capacity() OWNER TO polyrezo_user;

--
-- Name: enforce_ride_capacity(); Type: FUNCTION; Schema: public; Owner: polyrezo_user
--

CREATE FUNCTION public.enforce_ride_capacity() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE seats INT;
DECLARE taken INT;
BEGIN
  IF (NEW.status = 'accepted') THEN
    SELECT seats_total INTO seats FROM rides WHERE id = NEW.ride_id;
    SELECT count(*) INTO taken FROM ride_passengers
      WHERE ride_id = NEW.ride_id AND status='accepted';
    IF taken >= seats THEN
      RAISE EXCEPTION 'No seats available on ride %', NEW.ride_id;
    END IF;
  END IF;
  RETURN NEW;
END$$;


ALTER FUNCTION public.enforce_ride_capacity() OWNER TO polyrezo_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accommodation_guests; Type: TABLE; Schema: public; Owner: polyrezo_user
--

CREATE TABLE public.accommodation_guests (
    accommodation_id uuid NOT NULL,
    guest_id uuid NOT NULL,
    status character varying(20) NOT NULL,
    requested_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.accommodation_guests OWNER TO polyrezo_user;

--
-- Name: accommodations; Type: TABLE; Schema: public; Owner: polyrezo_user
--

CREATE TABLE public.accommodations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    host_id uuid NOT NULL,
    title text,
    address text,
    contact text,
    capacity integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    description text,
    CONSTRAINT accommodations_capacity_check CHECK ((capacity > 0))
);


ALTER TABLE public.accommodations OWNER TO polyrezo_user;

--
-- Name: event_participants; Type: TABLE; Schema: public; Owner: polyrezo_user
--

CREATE TABLE public.event_participants (
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    registered_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.event_participants OWNER TO polyrezo_user;

--
-- Name: TABLE event_participants; Type: COMMENT; Schema: public; Owner: polyrezo_user
--

COMMENT ON TABLE public.event_participants IS 'Table de liaison entre les événements et les utilisateurs qui y participent';


--
-- Name: events; Type: TABLE; Schema: public; Owner: polyrezo_user
--

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    school_id uuid NOT NULL,
    name text NOT NULL,
    activities text,
    starts_at timestamp with time zone NOT NULL,
    ends_at timestamp with time zone,
    address text,
    room text,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.events OWNER TO polyrezo_user;

--
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: polyrezo_user
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE public.flyway_schema_history OWNER TO polyrezo_user;

--
-- Name: ride_passengers; Type: TABLE; Schema: public; Owner: polyrezo_user
--

CREATE TABLE public.ride_passengers (
    ride_id uuid NOT NULL,
    passenger_id uuid NOT NULL,
    status public.request_status NOT NULL,
    requested_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ride_passengers OWNER TO polyrezo_user;

--
-- Name: rides; Type: TABLE; Schema: public; Owner: polyrezo_user
--

CREATE TABLE public.rides (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    driver_id uuid NOT NULL,
    seats_total integer NOT NULL,
    depart_time timestamp with time zone NOT NULL,
    depart_place text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT rides_seats_total_check CHECK ((seats_total > 0))
);


ALTER TABLE public.rides OWNER TO polyrezo_user;

--
-- Name: schools; Type: TABLE; Schema: public; Owner: polyrezo_user
--

CREATE TABLE public.schools (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.schools OWNER TO polyrezo_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: polyrezo_user
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    school_id uuid NOT NULL,
    role public.user_role NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text,
    email text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO polyrezo_user;

--
-- Name: v_events_with_countdown; Type: VIEW; Schema: public; Owner: polyrezo_user
--

CREATE VIEW public.v_events_with_countdown AS
 SELECT id,
    school_id,
    name,
    activities,
    starts_at,
    ends_at,
    address,
    room,
    created_by,
    created_at,
    ((starts_at)::date - CURRENT_DATE) AS days_until
   FROM public.events e;


ALTER VIEW public.v_events_with_countdown OWNER TO polyrezo_user;

--
-- Data for Name: accommodation_guests; Type: TABLE DATA; Schema: public; Owner: polyrezo_user
--

COPY public.accommodation_guests (accommodation_id, guest_id, status, requested_at) FROM stdin;
\.


--
-- Data for Name: accommodations; Type: TABLE DATA; Schema: public; Owner: polyrezo_user
--

COPY public.accommodations (id, event_id, host_id, title, address, contact, capacity, created_at, description) FROM stdin;
4a8e6f0f-15dd-4eea-8d0d-d3e431bf0ffb	d56b19f1-be62-4341-80b4-d85ae6f1e76c	316bc118-c82e-49db-ae30-d29b04040b50	logement wec	aaa	dev@polyrezo.com / 0600000000	1	2025-11-12 20:45:02.95976+00	
\.


--
-- Data for Name: event_participants; Type: TABLE DATA; Schema: public; Owner: polyrezo_user
--

COPY public.event_participants (event_id, user_id, registered_at) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: polyrezo_user
--

COPY public.events (id, school_id, name, activities, starts_at, ends_at, address, room, created_by, created_at) FROM stdin;
7d020399-7956-40e3-9a6b-72af78f68d9c	cf292bc3-c306-4a42-aa38-9975abacdcf2	WEC SACLAY	Week-End de Cohésion - Activités, soirées et rencontres réseau	2024-09-19 00:00:00+00	2024-09-21 23:59:59+00	Saclay, France	Campus Polytech Paris-Saclay	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
9adbc0aa-aace-4002-aeba-db8e82f32ac9	4182571f-b187-445e-9e10-f9fd6e4e3c90	SALMON	Soirée Salmon - Ambiance festive et conviviale	2024-10-04 00:00:00+00	2024-10-05 23:59:59+00	Angers, France	Lieu de soirée Angers	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
e3470a5c-57d8-4754-92ea-1e420ddf1130	c49036a5-df8d-4e9c-bdf1-3e946305c3fc	DISCOUNT	Soirée Discount - Ambiance économique et festive	2024-11-08 00:00:00+00	2024-11-09 23:59:59+00	Clermont-Ferrand, France	Lieu de soirée Clermont	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
960ff265-76dc-46e6-8837-c35f2fcad6f7	cf292bc3-c306-4a42-aa38-9975abacdcf2	DERRBY	Derrby Racing Event - Course de tacots et soirée	2024-11-15 00:00:00+00	2024-11-16 23:59:59+00	Saclay, France	Campus Polytech Paris-Saclay	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
14dd0aaa-f74e-4dc5-918c-b28d4cac23f7	fdc6c1e0-9e98-481f-b6c6-030e147bace5	PURRPLE	Soirée Purrple - Ambiance féline et festive	2024-11-22 00:00:00+00	2024-11-23 23:59:59+00	Tours, France	Lieu de soirée Tours	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
956b8377-b975-42c1-ba0c-464929080fc0	7143eea1-bb5f-401e-b1ee-c951daf165c2	RRED	RRED Party - Soirée rouge ardente	2024-11-29 00:00:00+00	2024-11-30 23:59:59+00	Lille, France	Lieu de soirée Lille	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
26bf75dd-9617-4b70-ba08-73fc2e0bfd23	4e8d468a-807b-4f6b-90ff-25d4da07ecb1	TPW	The Polytech Week - Une semaine d'événements réseau	2025-01-17 00:00:00+00	2025-01-18 23:59:59+00	Nantes, France	Campus Polytech Nantes	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
881402e9-6a37-4457-8896-e24d415b8646	ef1985c8-9dd5-4df6-a821-bc78d9434169	PINK	Pink Party - Soirée rose et glamour	2025-01-24 00:00:00+00	2025-01-25 23:59:59+00	Annecy, France	Lieu de soirée Annecy	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
5decc860-5f2d-4b1d-b505-f02070a20c95	9dc707da-75a4-45f1-92b5-44f9c9538277	WHITE	White Party - Soirée blanche immaculée	2025-02-07 00:00:00+00	2025-02-08 23:59:59+00	Grenoble, France	Lieu de soirée Grenoble	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
3fc69eaf-a766-49f8-a793-5a349ff05808	3e3ac004-46af-42c4-b76d-3366c78c8fbc	BLUE	Blue Night - Soirée bleue océanique	2025-02-21 00:00:00+00	2025-02-22 23:59:59+00	Montpellier, France	Lieu de soirée Montpellier	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
d56b19f1-be62-4341-80b4-d85ae6f1e76c	79c24aaa-92d2-4b22-b690-dcfeff82554a	GONE	Gone Party - Soirée lyonnaise	2025-02-28 00:00:00+00	2025-03-01 23:59:59+00	Lyon, France	Lieu de soirée Lyon	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
926f106c-e17d-4ccd-bb56-3c27eb7128f4	cf292bc3-c306-4a42-aa38-9975abacdcf2	CAMPAGNES SACLAY	Campagnes électorales - Présentation des listes	2025-03-10 00:00:00+00	2025-03-10 23:59:59+00	Saclay, France	Campus Polytech Paris-Saclay	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
92535229-a1aa-4dad-8081-4178ffeba87c	cf292bc3-c306-4a42-aa38-9975abacdcf2	GS	Grande Soirée - Événement majeur du réseau	2025-03-28 00:00:00+00	2025-03-29 23:59:59+00	Paris, France	Lieu de soirée Paris	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
355b2491-bf89-4b20-9fdb-15910c9b04c0	3b0f4090-6c66-4224-b508-385186616cf7	POLYSOUND	Festival PolySound - Festival de musique	2025-04-04 00:00:00+00	2025-04-05 23:59:59+00	Nancy, France	Campus Polytech Nancy	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
f6907324-f57a-4d86-9ad8-f02b0c2e6955	fdc6c1e0-9e98-481f-b6c6-030e147bace5	AG	Assemblée Générale - Bilan annuel et perspectives	2025-05-08 00:00:00+00	2025-05-10 23:59:59+00	Tours, France	Campus Polytech Tours	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
9e8dacc1-f838-4d5d-a052-58bd155c4db7	c4a8f416-275e-4616-9c62-67f82a731934	MNMS	MNMS Event - Soirée à thème	2024-10-18 00:00:00+00	2024-10-19 23:59:59+00	10 rue du test, Marseille, France	Lieu de soirée Marseille	316bc118-c82e-49db-ae30-d29b04040b50	2025-11-12 18:47:23.089085+00
\.


--
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: polyrezo_user
--

COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	1	init	SQL	V1__init.sql	-87588532	polyrezo_user	2025-10-24 14:30:36.013346	130	t
2	2	insert schools	SQL	V2__insert_schools.sql	-1884491572	polyrezo_user	2025-10-24 14:30:36.199335	11	t
3	3	update schools	SQL	V3__update_schools.sql	-1291731206	polyrezo_user	2025-10-24 14:30:36.238764	14	t
4	4	insert dev admin	SQL	V4__insert_dev_admin.sql	-1904941441	polyrezo_user	2025-10-24 14:30:36.278297	11	t
5	5	fix dev admin password	SQL	V5__fix_dev_admin_password.sql	512977975	polyrezo_user	2025-10-24 14:35:23.743264	13	t
6	8	change status to varchar	SQL	V8__change_status_to_varchar.sql	927447752	polyrezo_user	2025-11-12 19:01:09.582817	67	t
7	9	insert events	SQL	V9__insert_events.sql	1887557610	polyrezo_user	2025-11-12 19:47:23.060862	57	t
8	10	add description to accommodations	SQL	V10__add_description_to_accommodations.sql	338827812	polyrezo_user	2025-11-12 21:56:10.529181	28	t
\.


--
-- Data for Name: ride_passengers; Type: TABLE DATA; Schema: public; Owner: polyrezo_user
--

COPY public.ride_passengers (ride_id, passenger_id, status, requested_at) FROM stdin;
\.


--
-- Data for Name: rides; Type: TABLE DATA; Schema: public; Owner: polyrezo_user
--

COPY public.rides (id, event_id, driver_id, seats_total, depart_time, depart_place, notes, created_at) FROM stdin;
\.


--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: polyrezo_user
--

COPY public.schools (id, name) FROM stdin;
7143eea1-bb5f-401e-b1ee-c951daf165c2	Lille
bb3ef6b3-f491-4a72-b86d-0bf55e621ed7	Sorbonne
cf292bc3-c306-4a42-aa38-9975abacdcf2	Paris-Saclay
3b0f4090-6c66-4224-b508-385186616cf7	Nancy
1eebf83d-8bdc-4181-8cfa-1464aa7ebefa	Orléans
fdc6c1e0-9e98-481f-b6c6-030e147bace5	Tours
4182571f-b187-445e-9e10-f9fd6e4e3c90	Angers
4e8d468a-807b-4f6b-90ff-25d4da07ecb1	Nantes
9eb4423e-4102-46ff-bcfe-616526f06e73	Dijon
ef1985c8-9dd5-4df6-a821-bc78d9434169	Annecy-Chambery
79c24aaa-92d2-4b22-b690-dcfeff82554a	Lyon
9dc707da-75a4-45f1-92b5-44f9c9538277	Grenoble
c49036a5-df8d-4e9c-bdf1-3e946305c3fc	Clermont
3e3ac004-46af-42c4-b76d-3366c78c8fbc	Montpellier
c4a8f416-275e-4616-9c62-67f82a731934	Marseille
a739ce9f-659d-47cb-858a-057d91785dd5	Nice Sophia
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: polyrezo_user
--

COPY public.users (id, school_id, role, first_name, last_name, phone, email, password_hash, created_at) FROM stdin;
316bc118-c82e-49db-ae30-d29b04040b50	79c24aaa-92d2-4b22-b690-dcfeff82554a	admin	Dev	Admin	0600000000	dev@polyrezo.com	$2a$10$uyQFXLCUtGd6mJ9tyNo5KeA6ymiYxDfIV0Ro8EG/5/GwQ3msGtH2m	2025-10-24 12:30:36.290122+00
f2e45c08-38de-436d-80df-c60099b508e2	cf292bc3-c306-4a42-aa38-9975abacdcf2	member	Valisoa Andrianina	RANDRIANOELINA	0783788773	valisoagasy@gmail.com	$2a$10$L2DSsnUW2Za083wMjIn9LO2se2LACoyTZy27rMFWfvomy62MCSRFe	2025-11-12 17:27:46.245364+00
3e179a12-8fdb-42a2-b0ad-0a3fff6a956b	7143eea1-bb5f-401e-b1ee-c951daf165c2	admin	Romane	Fransquin		romane@gmail.com	$2a$10$vBcW76v0DECd5u8VOEIrN.Fk17wk.Xcpn7dhbP76IlvRj0qW5Eawy	2025-11-12 21:11:53.438577+00
\.


--
-- Name: accommodation_guests accommodation_guests_pkey; Type: CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.accommodation_guests
    ADD CONSTRAINT accommodation_guests_pkey PRIMARY KEY (accommodation_id, guest_id);


--
-- Name: accommodations accommodations_event_id_host_id_title_key; Type: CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.accommodations
    ADD CONSTRAINT accommodations_event_id_host_id_title_key UNIQUE (event_id, host_id, title);


--
-- Name: accommodations accommodations_pkey; Type: CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.accommodations
    ADD CONSTRAINT accommodations_pkey PRIMARY KEY (id);


--
-- Name: event_participants event_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.event_participants
    ADD CONSTRAINT event_participants_pkey PRIMARY KEY (event_id, user_id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- Name: ride_passengers ride_passengers_pkey; Type: CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.ride_passengers
    ADD CONSTRAINT ride_passengers_pkey PRIMARY KEY (ride_id, passenger_id);


--
-- Name: rides rides_pkey; Type: CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.rides
    ADD CONSTRAINT rides_pkey PRIMARY KEY (id);


--
-- Name: schools schools_name_key; Type: CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_name_key UNIQUE (name);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: accommodation_guests_status_idx; Type: INDEX; Schema: public; Owner: polyrezo_user
--

CREATE INDEX accommodation_guests_status_idx ON public.accommodation_guests USING btree (accommodation_id, status);


--
-- Name: accommodations_event_idx; Type: INDEX; Schema: public; Owner: polyrezo_user
--

CREATE INDEX accommodations_event_idx ON public.accommodations USING btree (event_id);


--
-- Name: events_school_id_starts_at_idx; Type: INDEX; Schema: public; Owner: polyrezo_user
--

CREATE INDEX events_school_id_starts_at_idx ON public.events USING btree (school_id, starts_at);


--
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: polyrezo_user
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- Name: idx_event_participants_event; Type: INDEX; Schema: public; Owner: polyrezo_user
--

CREATE INDEX idx_event_participants_event ON public.event_participants USING btree (event_id);


--
-- Name: idx_event_participants_user; Type: INDEX; Schema: public; Owner: polyrezo_user
--

CREATE INDEX idx_event_participants_user ON public.event_participants USING btree (user_id);


--
-- Name: ride_passengers_status_idx; Type: INDEX; Schema: public; Owner: polyrezo_user
--

CREATE INDEX ride_passengers_status_idx ON public.ride_passengers USING btree (ride_id, status);


--
-- Name: rides_event_id_depart_time_idx; Type: INDEX; Schema: public; Owner: polyrezo_user
--

CREATE INDEX rides_event_id_depart_time_idx ON public.rides USING btree (event_id, depart_time);


--
-- Name: users_school_role_idx; Type: INDEX; Schema: public; Owner: polyrezo_user
--

CREATE INDEX users_school_role_idx ON public.users USING btree (school_id, role);


--
-- Name: accommodation_guests trg_accommodation_capacity; Type: TRIGGER; Schema: public; Owner: polyrezo_user
--

CREATE TRIGGER trg_accommodation_capacity BEFORE INSERT OR UPDATE ON public.accommodation_guests FOR EACH ROW EXECUTE FUNCTION public.enforce_accommodation_capacity();


--
-- Name: ride_passengers trg_ride_capacity; Type: TRIGGER; Schema: public; Owner: polyrezo_user
--

CREATE TRIGGER trg_ride_capacity BEFORE INSERT OR UPDATE ON public.ride_passengers FOR EACH ROW EXECUTE FUNCTION public.enforce_ride_capacity();


--
-- Name: accommodation_guests accommodation_guests_accommodation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.accommodation_guests
    ADD CONSTRAINT accommodation_guests_accommodation_id_fkey FOREIGN KEY (accommodation_id) REFERENCES public.accommodations(id) ON DELETE CASCADE;


--
-- Name: accommodation_guests accommodation_guests_guest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.accommodation_guests
    ADD CONSTRAINT accommodation_guests_guest_id_fkey FOREIGN KEY (guest_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: accommodations accommodations_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.accommodations
    ADD CONSTRAINT accommodations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: accommodations accommodations_host_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.accommodations
    ADD CONSTRAINT accommodations_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: event_participants event_participants_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.event_participants
    ADD CONSTRAINT event_participants_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: event_participants event_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.event_participants
    ADD CONSTRAINT event_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: events events_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: events events_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE CASCADE;


--
-- Name: ride_passengers ride_passengers_passenger_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.ride_passengers
    ADD CONSTRAINT ride_passengers_passenger_id_fkey FOREIGN KEY (passenger_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: ride_passengers ride_passengers_ride_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.ride_passengers
    ADD CONSTRAINT ride_passengers_ride_id_fkey FOREIGN KEY (ride_id) REFERENCES public.rides(id) ON DELETE CASCADE;


--
-- Name: rides rides_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.rides
    ADD CONSTRAINT rides_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: rides rides_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.rides
    ADD CONSTRAINT rides_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: users users_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: polyrezo_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict fjpYXZjk3fajk0anpkFEedVfUOBzzybNkrpE1J06eaGmFf6Wmq5s5R1apdIEwjh

