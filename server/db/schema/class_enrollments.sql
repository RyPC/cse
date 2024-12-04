CREATE TABLE IF NOT EXISTS class_enrollments (
    id SERIAL,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    attendance DATE NOT NULL,

    CONSTRAINT fk_student
        FOREIGN KEY(student_id)
        REFERENCES student(id)
        ON DELETE CASCADE,

    CONSTRAINT Pk_student_class_id
        PRIMARY KEY(student_id, class_id, id),
    
    CONSTRAINT fk_class
        FOREIGN KEY(class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE
)