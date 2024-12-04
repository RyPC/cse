CREATE TABLE Student (
    id INTEGER NOT NULL PRIMARY KEY,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    CONSTRAINT fk_user_student FOREIGN KEY (id) REFERENCES User (id)
);