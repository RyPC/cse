import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const eventsRouter = express.Router();
eventsRouter.use(express.json());

eventsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eventID = await db.query('SELECT * FROM events WHERE id = $1', [id])

    res.status(200).json(keysToCamel(eventID));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventsRouter.get("/", async (req, res) => {
    try {
        const allEvents = await db.query('SELECT * FROM events;');
      res.status(200).json(keysToCamel(allEvents));
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

eventsRouter.post("/", async (req, res) => {
  try {
    const {location, title, description, level, date, start_time, end_time, call_time, class_id, costume} = req.body;
    const result = await db.query(
        'INSERT INTO events (location, title, description, level, date, start_time, end_time, call_time, class_id, costume) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;',
        [location, title, description, level, date, start_time, end_time, call_time, class_id, costume],
    );

    res.status(201).json(keysToCamel(result));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

eventsRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {location, title, description, level, date, start_time, end_time, call_time, class_id, costume} = req.body;
        const updatedEvent = await db.query(
          `UPDATE events
          SET location = $1,
           title = $2,
           description = $3,
           level = $4,
           date = $5,
           start_time = $6,
           end_time = $7,
           call_time = $8,
           class_id = $9,
           costume = $10
       WHERE id = $11
       RETURNING *;`,
       [location, title, description, level, date, start_time, end_time, call_time, class_id, costume, id],
        );
        return res.status(200).send(keysToCamel(updatedEvent));
      } catch (err) {
        return res.status(500).send(err.message);
      }
});

eventsRouter.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedEvent = await db.query(`DELETE FROM events WHERE id = $1 RETURNING *;`, [id]);
      res.status(200).send(keysToCamel(deletedEvent));
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

export { eventsRouter };
