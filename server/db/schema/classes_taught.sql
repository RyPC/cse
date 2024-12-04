CREATE TABLE IF NOT EXISTS classes_taught (
    class_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    
    CONSTRAINT fk_class
        FOREIGN KEY(class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE
    
    CONSTRAINT fk_teacher
        FOREIGN KEY(teacher_id)
        REFERENCES teacher(id)
        ON DELETE CASCADE
)