CREATE TABLE IF NOT EXISTS event_enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  attendance BOOLEAN NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
);
