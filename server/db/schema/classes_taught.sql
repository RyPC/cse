CREATE TABLE IF NOT EXISTS classes_taught (
    class_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    
    CONSTRAINT Pk_classes_taught
        PRIMARY KEY(class_id, teacher_id),

    CONSTRAINT fk_class
        FOREIGN KEY(class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_teacher
        FOREIGN KEY(teacher_id)
        REFERENCES teachers(id)
        ON DELETE CASCADE
)