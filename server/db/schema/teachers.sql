CREATE TABLE teachers (
    id INTEGER NOT NULL PRIMARY KEY,
    experience TEXT,
    is_activated BOOL NOT NULL,
    CONSTRAINT fk_user_teacher FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE
 );