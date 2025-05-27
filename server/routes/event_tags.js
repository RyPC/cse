import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const eventTagsRouter = express.Router();

eventTagsRouter.use(express.json());

// tags for a single event
eventTagsRouter.get("/tags/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const tags = await db.query(
      `SELECT * FROM event_tags JOIN tags on event_tags.tag_id = tags.id WHERE event_tags.event_id = $1;`,
      [id]
    );
    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get all events matching a tag
eventTagsRouter.get("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const events = await db.query(
      `SELECT * FROM event_tags JOIN events on event_tags.event_id = events.id WHERE event_tags.tag_id = $1;`,
      [id]
    );
    res.status(200).json(keysToCamel(events));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// post new tag/event relationship
eventTagsRouter.post("/", async (req, res) => {
  try {
    const { eventId, tagId } = req.body;
    const tags = await db.query(
      `INSERT INTO event_tags (event_id, tag_id) VALUES ($1, $2) RETURNING *;`,
      [eventId, tagId]
    );
    res.status(201).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// delete event/tag relationship
eventTagsRouter.delete("/", async (req, res) => {
  try {
    const { eventId, tagId } = req.body;
    const tags = await db.query(
      `DELETE FROM event_tags WHERE event_id = $1 AND tag_id = $2 RETURNING *;`,
      [eventId, tagId]
    );
    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { eventTagsRouter };
