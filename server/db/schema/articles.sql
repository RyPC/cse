CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    s3_url VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    media_url VARCHAR(256) NOT NULL
);
