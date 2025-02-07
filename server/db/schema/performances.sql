
CREATE TABLE performances (
    class_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    PRIMARY KEY (class_id, event_id),
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);