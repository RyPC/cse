CREATE TABLE video_tags(
    id INTEGER PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    video_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY (video_id) REFERENCES class_videos(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);