CREATE TABLE IF NOT EXISTS classes_taught (
    class_id INT NOT NULL,
    teacher_id INT NOT NULL,
    
    CONSTRAINT fk_class
        FOREIGN KEY(class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE
    
    CONSTRAINT fk_teacher
        FOREIGN KEY(teacher_id)
        REFERENCES teacher(id)
        ON DELETE CASCADE
)