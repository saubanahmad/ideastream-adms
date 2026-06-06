-- 1. Add database-level constraints
ALTER TABLE "users" ADD CONSTRAINT users_username_min_length CHECK (char_length(username) >= 3);
ALTER TABLE "users" ADD CONSTRAINT users_email_format_check CHECK (email LIKE '%@%.%');
ALTER TABLE "users" ADD CONSTRAINT users_fullname_min_length CHECK (char_length("fullName") >= 1);
ALTER TABLE "users" ADD CONSTRAINT users_password_hash_min_length CHECK (char_length(password) >= 20);

-- 2. Add functional unique indexes for case-insensitive uniqueness
CREATE UNIQUE INDEX users_email_lower_key ON "users"(LOWER(email));
CREATE UNIQUE INDEX users_username_lower_key ON "users"(LOWER(username));

-- 4. Optimize user search using PostgreSQL trigram index
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX users_username_trgm_idx ON "users" USING GIN ("username" gin_trgm_ops);
CREATE INDEX users_fullname_trgm_idx ON "users" USING GIN ("fullName" gin_trgm_ops);
CREATE INDEX users_email_trgm_idx ON "users" USING GIN ("email" gin_trgm_ops);