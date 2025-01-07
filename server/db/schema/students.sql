CREATE TYPE LEVEL AS ENUM('beginner','intermediate','advanced');


CREATE TABLE Student (
    id INTEGER NOT NULL PRIMARY KEY,
    level LEVEL NOT NULL,
    CONSTRAINT fk_user_student FOREIGN KEY (id) REFERENCES User (id) ON DELETE CASCADE
);
