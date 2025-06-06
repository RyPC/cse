CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    s3_url VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    media_url VARCHAR(256) NOT NULL,
    teacher_id INTEGER NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);
