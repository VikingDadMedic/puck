-- Bootstraps the Directus-specific database and role inside the shared
-- Postgres instance.  Executed once via the docker-entrypoint-initdb.d mount.

CREATE USER directus WITH PASSWORD 'directus';
CREATE DATABASE directus OWNER directus;
GRANT ALL PRIVILEGES ON DATABASE directus TO directus;

-- Supabase services use the default "postgres" database, so no additional
-- setup is needed for them here.
