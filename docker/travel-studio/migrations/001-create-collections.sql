-- 001-create-collections.sql
-- Travel Studio collections for Directus.
-- Run via: npx directus database migrate:latest
-- Or apply manually against the Directus Postgres database.
-- Directus will auto-detect these tables under Settings → Data Model → "+"
-- and allow configuring field interfaces, relations, and display templates.

BEGIN;

-- ============================================================
-- Enable pgcrypto for gen_random_uuid() if not already present
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. trips — top-level trip container
-- ============================================================
CREATE TABLE IF NOT EXISTS trips (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    status          varchar(20)  NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','in_review','published','archived')),
    title           varchar(255) NOT NULL,
    destination     varchar(255) NOT NULL DEFAULT '',
    start_date      date,
    end_date        date,
    visibility      varchar(10)  NOT NULL DEFAULT 'visible'
                        CHECK (visibility IN ('visible','hidden')),
    brand_theme     varchar(20)  NOT NULL DEFAULT 'default'
                        CHECK (brand_theme IN ('default','luxury','adventure')),
    currency        varchar(3)   NOT NULL DEFAULT 'USD',
    puck_data       jsonb,
    itinerary_data  jsonb,
    version         integer      NOT NULL DEFAULT 0,

    user_created    uuid REFERENCES directus_users(id) ON DELETE SET NULL,
    user_updated    uuid REFERENCES directus_users(id) ON DELETE SET NULL,
    date_created    timestamptz  NOT NULL DEFAULT now(),
    date_updated    timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX idx_trips_status     ON trips (status);
CREATE INDEX idx_trips_start_date ON trips (start_date);

-- ============================================================
-- 2. travelers — traveler profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS travelers (
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 uuid REFERENCES directus_users(id) ON DELETE SET NULL,
    first_name              varchar(255) NOT NULL,
    last_name               varchar(255) NOT NULL,
    email                   varchar(255) NOT NULL,
    phone                   varchar(50),
    passport_number         varchar(50),
    passport_expiry         date,
    nationality             varchar(100),
    dietary_requirements    text,
    loyalty_programs        jsonb,
    emergency_contact_name  varchar(255),
    emergency_contact_phone varchar(50),

    date_created            timestamptz NOT NULL DEFAULT now(),
    date_updated            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_travelers_email   ON travelers (email);
CREATE INDEX idx_travelers_user_id ON travelers (user_id);

-- ============================================================
-- 3. trips_travelers — M2M junction
-- ============================================================
CREATE TABLE IF NOT EXISTS trips_travelers (
    id           serial PRIMARY KEY,
    trips_id     uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    travelers_id uuid NOT NULL REFERENCES travelers(id) ON DELETE CASCADE,
    role         varchar(20) NOT NULL DEFAULT 'companion'
                     CHECK (role IN ('lead','companion','advisor')),

    UNIQUE (trips_id, travelers_id)
);

CREATE INDEX idx_trips_travelers_trip     ON trips_travelers (trips_id);
CREATE INDEX idx_trips_travelers_traveler ON trips_travelers (travelers_id);

-- ============================================================
-- 4. suppliers — supplier directory
-- ============================================================
CREATE TABLE IF NOT EXISTS suppliers (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name           varchar(255) NOT NULL,
    supplier_type  varchar(20)  NOT NULL DEFAULT 'other'
                       CHECK (supplier_type IN (
                           'airline','hotel','cruise_line',
                           'tour_operator','restaurant','other'
                       )),
    contact_email  varchar(255),
    contact_phone  varchar(50),
    website        varchar(500),
    logo           uuid REFERENCES directus_files(id) ON DELETE SET NULL,
    notes          text
);

CREATE INDEX idx_suppliers_type ON suppliers (supplier_type);

-- ============================================================
-- 5. event_stay — lodging events (maps to LodgingEvent)
-- ============================================================
CREATE TABLE IF NOT EXISTS event_stay (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 varchar(255) NOT NULL,
    location             varchar(500),
    check_in             date,
    check_out            date,
    timing_time          varchar(10),
    room_type            varchar(100),
    confirmation_number  varchar(100),
    rating               numeric(2,1),
    image_url            varchar(1000),
    notes                text,
    supplier_id          uuid REFERENCES suppliers(id) ON DELETE SET NULL,
    coordinates          jsonb,
    price_amount         numeric(12,2),
    price_currency       varchar(3) DEFAULT 'USD',
    media                jsonb,
    attachments          jsonb
);

-- ============================================================
-- 6. event_activity — activity events (maps to ActivityEvent)
-- ============================================================
CREATE TABLE IF NOT EXISTS event_activity (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 varchar(255) NOT NULL,
    description          text,
    sub_category         varchar(20) DEFAULT 'activity'
                             CHECK (sub_category IN ('activity','foodDrink')),
    timing_date          date,
    timing_time          varchar(10),
    timing_duration      varchar(50),
    confirmation_number  varchar(100),
    image_url            varchar(1000),
    notes                text,
    supplier_id          uuid REFERENCES suppliers(id) ON DELETE SET NULL,
    provider_name        varchar(255),
    coordinates          jsonb,
    price_amount         numeric(12,2),
    price_currency       varchar(3) DEFAULT 'USD',
    media                jsonb,
    attachments          jsonb
);

-- ============================================================
-- 7. event_transport — transport events
--    (maps to FlightEvent, RailEvent, CarRentalEvent, OtherTransportEvent)
-- ============================================================
CREATE TABLE IF NOT EXISTS event_transport (
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    transport_type          varchar(20) NOT NULL DEFAULT 'flight'
                                CHECK (transport_type IN (
                                    'flight','rail','car_rental','ferry','transfer','other'
                                )),
    event_type              varchar(20) DEFAULT 'departure'
                                CHECK (event_type IN ('departure','arrival','pickUp','dropOff')),
    carrier_name            varchar(255),
    departure               varchar(500),
    arrival                 varchar(500),
    timing_date             date,
    timing_time             varchar(10),
    timing_duration         varchar(50),
    flight_number           varchar(20),
    train_number            varchar(20),
    terminal                varchar(50),
    gate                    varchar(20),
    seat_details            varchar(100),
    confirmation_number     varchar(100),
    notes                   text,
    supplier_id             uuid REFERENCES suppliers(id) ON DELETE SET NULL,
    departure_coordinates   jsonb,
    arrival_coordinates     jsonb,
    price_amount            numeric(12,2),
    price_currency          varchar(3) DEFAULT 'USD',
    media                   jsonb,
    attachments             jsonb
);

CREATE INDEX idx_event_transport_type ON event_transport (transport_type);

-- ============================================================
-- 8. event_restaurant — restaurant/dining events
--    (maps to ActivityEvent with subCategory "foodDrink")
-- ============================================================
CREATE TABLE IF NOT EXISTS event_restaurant (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 varchar(255) NOT NULL,
    cuisine              varchar(100),
    rating               numeric(2,1),
    timing_date          date,
    timing_time          varchar(10),
    confirmation_number  varchar(100),
    image_url            varchar(1000),
    notes                text,
    supplier_id          uuid REFERENCES suppliers(id) ON DELETE SET NULL,
    coordinates          jsonb,
    price_amount         numeric(12,2),
    price_currency       varchar(3) DEFAULT 'USD',
    media                jsonb,
    attachments          jsonb
);

-- ============================================================
-- 9. event_cruise — cruise events (maps to CruiseEvent)
-- ============================================================
CREATE TABLE IF NOT EXISTS event_cruise (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 varchar(255) NOT NULL,
    carrier_name         varchar(255),
    cabin_type           varchar(100),
    cabin_number         varchar(50),
    event_type           varchar(20) DEFAULT 'departure'
                             CHECK (event_type IN ('departure','arrival')),
    timing_date          date,
    timing_duration      varchar(50),
    confirmation_number  varchar(100),
    notes                text,
    supplier_id          uuid REFERENCES suppliers(id) ON DELETE SET NULL,
    price_amount         numeric(12,2),
    price_currency       varchar(3) DEFAULT 'USD',
    media                jsonb,
    attachments          jsonb
);

-- ============================================================
-- 10. event_tour — tour events (maps to TourEvent)
-- ============================================================
CREATE TABLE IF NOT EXISTS event_tour (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 varchar(255) NOT NULL,
    timing_date          date,
    timing_time          varchar(10),
    timing_duration      varchar(50),
    timing_timezone      varchar(50),
    confirmation_number  varchar(100),
    meeting_point        varchar(500),
    group_size           integer,
    included             text,
    notes                text,
    booked_through_id    uuid REFERENCES suppliers(id) ON DELETE SET NULL,
    provider_id          uuid REFERENCES suppliers(id) ON DELETE SET NULL,
    image_url            varchar(1000),
    coordinates          jsonb,
    price_amount         numeric(12,2),
    price_currency       varchar(3) DEFAULT 'USD',
    media                jsonb,
    attachments          jsonb
);

-- ============================================================
-- 11. event_booking — generic booking events (maps to BookingEvent)
-- ============================================================
CREATE TABLE IF NOT EXISTS event_booking (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 varchar(255) NOT NULL,
    sub_category         varchar(50),
    timing_date          date,
    timing_time          varchar(10),
    timing_duration      varchar(50),
    timing_timezone      varchar(50),
    confirmation_number  varchar(100),
    booking_reference    varchar(100),
    notes                text,
    booked_through_id    uuid REFERENCES suppliers(id) ON DELETE SET NULL,
    provider_id          uuid REFERENCES suppliers(id) ON DELETE SET NULL,
    price_amount         numeric(12,2),
    price_currency       varchar(3) DEFAULT 'USD',
    media                jsonb,
    attachments          jsonb
);

-- ============================================================
-- 12. event_info — informational events (maps to InfoEvent)
-- ============================================================
CREATE TABLE IF NOT EXISTS event_info (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 varchar(255) NOT NULL,
    sub_category         varchar(20) DEFAULT 'info'
                             CHECK (sub_category IN ('info','cityGuide')),
    notes                text,
    media                jsonb,
    attachments          jsonb
);

-- ============================================================
-- 13. itinerary_events — M2A junction (Many-to-Any)
--     Links trips to any event_* collection via collection/item
--     discriminator pattern (Directus M2A convention).
-- ============================================================
CREATE TABLE IF NOT EXISTS itinerary_events (
    id          serial PRIMARY KEY,
    trips_id    uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    collection  varchar(50) NOT NULL
                    CHECK (collection IN (
                        'event_stay','event_activity','event_transport',
                        'event_restaurant','event_cruise',
                        'event_tour','event_booking','event_info'
                    )),
    item        uuid NOT NULL,
    sort        integer NOT NULL DEFAULT 0,
    day_label   varchar(100),
    time_slot   varchar(20)
                    CHECK (time_slot IS NULL OR time_slot IN ('morning','afternoon','evening'))
);

CREATE INDEX idx_itinerary_events_trip       ON itinerary_events (trips_id);
CREATE INDEX idx_itinerary_events_collection ON itinerary_events (collection, item);
CREATE INDEX idx_itinerary_events_sort       ON itinerary_events (trips_id, sort);

COMMIT;
