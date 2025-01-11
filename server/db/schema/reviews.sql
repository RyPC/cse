CREATE TABLE IF NOT EXISTS public.reviews(
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    review VARCHAR(256),

    CONSTRAINT review_pkey PRIMARY KEY(student_id, class_id),
    CONSTRAINT fk_student FOREIGN KEY(student_id) REFERENCES students(student_id) ON DELETE CASCADE
    CONSTRAINT fk_class FOREIGN KEY(class_id) REFERENCES classes(class_id) ON DELETE CASCADE
    

);