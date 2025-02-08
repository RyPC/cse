CREATE TYPE LEVEL AS ENUM('beginner','intermediate','advanced');


CREATE TABLE students (
    id INTEGER NOT NULL PRIMARY KEY,
    level LEVEL NOT NULL,
    CONSTRAINT fk_user_student FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE
);
