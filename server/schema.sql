--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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
-- Name: mood; Type: TYPE; Schema: public; Owner: sumbhav
--

CREATE TYPE public.mood AS ENUM (
    'good',
    'bad',
    'okay'
);


ALTER TYPE public.mood OWNER TO sumbhav;

--
-- Name: update_settings_finished(); Type: FUNCTION; Schema: public; Owner: sumbhav
--

CREATE FUNCTION public.update_settings_finished() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Update settings_finished in the users table using the id field
  UPDATE users
  SET settings_finished = true
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_settings_finished() OWNER TO sumbhav;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: daily_logs; Type: TABLE; Schema: public; Owner: sumbhav
--

CREATE TABLE public.daily_logs (
    user_id integer NOT NULL,
    date date NOT NULL,
    total_calories integer DEFAULT 0,
    meals_count integer DEFAULT 0,
    sleep_hours numeric(3,1) DEFAULT 0.0,
    goals_met boolean DEFAULT false,
    streak integer DEFAULT 0,
    updated_at timestamp without time zone DEFAULT now(),
    mood public.mood
);


ALTER TABLE public.daily_logs OWNER TO sumbhav;

--
-- Name: meal_logs; Type: TABLE; Schema: public; Owner: sumbhav
--

CREATE TABLE public.meal_logs (
    user_id integer NOT NULL,
    date date NOT NULL,
    meal_number integer NOT NULL,
    calories integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.meal_logs OWNER TO sumbhav;

--
-- Name: sleep_logs; Type: TABLE; Schema: public; Owner: sumbhav
--

CREATE TABLE public.sleep_logs (
    user_id integer NOT NULL,
    date date NOT NULL,
    bedtime time without time zone NOT NULL,
    wakeup_time time without time zone NOT NULL,
    sleep_hours numeric(3,1) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sleep_logs OWNER TO sumbhav;

--
-- Name: user_settings; Type: TABLE; Schema: public; Owner: sumbhav
--

CREATE TABLE public.user_settings (
    user_id integer NOT NULL,
    calories_per_day integer,
    bedtime time without time zone,
    wakeup_time time without time zone,
    sleep_hours double precision,
    meals_per_day integer,
    notifications_sleep boolean,
    notifications_meals boolean,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_settings OWNER TO sumbhav;

--
-- Name: users; Type: TABLE; Schema: public; Owner: sumbhav
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(200) NOT NULL,
    email character varying(200) NOT NULL,
    password character varying(200) NOT NULL,
    settings_finished boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO sumbhav;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: sumbhav
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO sumbhav;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sumbhav
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: sumbhav
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: daily_logs daily_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: sumbhav
--

ALTER TABLE ONLY public.daily_logs
    ADD CONSTRAINT daily_logs_pkey PRIMARY KEY (user_id, date);


--
-- Name: meal_logs meal_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: sumbhav
--

ALTER TABLE ONLY public.meal_logs
    ADD CONSTRAINT meal_logs_pkey PRIMARY KEY (user_id, date, meal_number);


--
-- Name: sleep_logs sleep_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: sumbhav
--

ALTER TABLE ONLY public.sleep_logs
    ADD CONSTRAINT sleep_logs_pkey PRIMARY KEY (user_id, date);


--
-- Name: user_settings user_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: sumbhav
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: sumbhav
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: sumbhav
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: user_settings settings_updated; Type: TRIGGER; Schema: public; Owner: sumbhav
--

CREATE TRIGGER settings_updated AFTER INSERT OR UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_settings_finished();


--
-- Name: daily_logs daily_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sumbhav
--

ALTER TABLE ONLY public.daily_logs
    ADD CONSTRAINT daily_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: meal_logs meal_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sumbhav
--

ALTER TABLE ONLY public.meal_logs
    ADD CONSTRAINT meal_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: sleep_logs sleep_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sumbhav
--

ALTER TABLE ONLY public.sleep_logs
    ADD CONSTRAINT sleep_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_settings user_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sumbhav
--

ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

