CREATE TABLE IF NOT EXISTS class_enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    attendance DATE NOT NULL,

    CONSTRAINT fk_student
        FOREIGN KEY(student_id)
        REFERENCES student(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_class
        FOREIGN KEY(class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE 
)