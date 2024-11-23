DROP TABLE IF EXISTS scheduled_classes CASCADE;

CREATE TABLE scheduled_classes (
  class_id INTEGER PRIMARY KEY NOT NULL,
  date DATE PRIMARY KEY NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

