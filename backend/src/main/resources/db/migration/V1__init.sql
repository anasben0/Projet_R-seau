-- Extensions utiles
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- pour gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- pour recherche floue si besoin

-- Types ENUM
CREATE TYPE user_role AS ENUM ('member', 'admin');
CREATE TYPE request_status AS ENUM ('requested', 'accepted', 'declined');

-- Écoles (nom = ville)
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

-- Utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  role user_role NOT NULL,
  first_name TEXT NOT NULL,
  last_name  TEXT NOT NULL,
  phone TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Évènements
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  activities TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at   TIMESTAMPTZ,
  address TEXT,
  room TEXT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT
);
CREATE INDEX ON events (school_id, starts_at);

-- Hébergements proposés
CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  host_id  UUID NOT NULL REFERENCES users(id)  ON DELETE RESTRICT,
  title TEXT,
  address TEXT,
  contact TEXT,
  capacity INT NOT NULL CHECK (capacity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, host_id, title)
);

-- Demandes d'hébergement
CREATE TABLE accommodation_guests (
  accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status request_status NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (accommodation_id, guest_id)
);

-- Trajets covoiturage
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  seats_total INT NOT NULL CHECK (seats_total > 0),
  depart_time TIMESTAMPTZ NOT NULL,
  depart_place TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON rides (event_id, depart_time);

-- Passagers des trajets
CREATE TABLE ride_passengers (
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  passenger_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status request_status NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (ride_id, passenger_id)
);

-- ====== Triggers anti-surbooking ======

-- Hébergement : pas plus d'acceptés que capacity
CREATE OR REPLACE FUNCTION enforce_accommodation_capacity()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
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

CREATE TRIGGER trg_accommodation_capacity
BEFORE INSERT OR UPDATE ON accommodation_guests
FOR EACH ROW EXECUTE FUNCTION enforce_accommodation_capacity();

-- Covoiturage : pas plus de passagers que seats_total
CREATE OR REPLACE FUNCTION enforce_ride_capacity()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
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

CREATE TRIGGER trg_ride_capacity
BEFORE INSERT OR UPDATE ON ride_passengers
FOR EACH ROW EXECUTE FUNCTION enforce_ride_capacity();

-- Vue pratique : évènements + jours restants
CREATE OR REPLACE VIEW v_events_with_countdown AS
SELECT e.*,
       (e.starts_at::date - CURRENT_DATE) AS days_until
FROM events e;

-- Index complémentaires
CREATE INDEX users_school_role_idx ON users (school_id, role);
CREATE INDEX accommodations_event_idx ON accommodations (event_id);
CREATE INDEX accommodation_guests_status_idx ON accommodation_guests (accommodation_id, status);
CREATE INDEX ride_passengers_status_idx ON ride_passengers (ride_id, status);
