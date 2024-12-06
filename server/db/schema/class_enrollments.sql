CREATE TABLE IF NOT EXISTS class_enrollments (
    id SERIAL,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    attendance DATE NOT NULL,

    CONSTRAINT Pk_class_enrollments
        PRIMARY KEY(student_id, class_id, id),

    CONSTRAINT fk_student
        FOREIGN KEY(student_id)
        REFERENCES student(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_class
        FOREIGN KEY(class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE
)