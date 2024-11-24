DROP TABLE IF EXISTS scheduled_classes CASCADE;

CREATE TABLE scheduled_classes (
  class_id INTEGER NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  PRIMARY KEY (class_id, date),
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

