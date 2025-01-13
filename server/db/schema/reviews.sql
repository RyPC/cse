CREATE TABLE IF NOT EXISTS public.reviews(
    class_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    review VARCHAR(256),

    CONSTRAINT review_pkey PRIMARY KEY(class_id, student_id),
    CONSTRAINT fk_class FOREIGN KEY(class_id) REFERENCES classes(class_id) ON DELETE CASCADE
    CONSTRAINT fk_student FOREIGN KEY(student_id) REFERENCES students(student_id) ON DELETE CASCADE
);
