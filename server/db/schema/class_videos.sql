DROP TABLE IF EXISTS class_videos CASCADE;

CREATE TABLE class_videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(256) NOT NULL,
  s3_url VARCHAR(256) NOT NULL,
  description TEXT NOT NULL,
  media_url TEXT NOT NULL,
  class_id INTEGER NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

