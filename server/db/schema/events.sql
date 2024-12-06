DROP TABLE IF EXISTS Events;
DROP TYPE IF EXISTS level;

CREATE TYPE LEVEL AS ENUM ('beginner', 'intermediate', 'advanced');

CREATE TABLE Events (
    id SERIAL PRIMARY KEY,
    location VARCHAR(256) NOT NULL,
    title VARCHAR(256) NOT NULL,
    description TEXT,
    level LEVEL NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    call_time TIME NOT NULL,
    class_id INTEGER NOT NULL,
    costume TEXT NOT NULL,
    FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE
);