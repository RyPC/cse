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

        const query = `UPDATE events SET
        location = COALESCE($1, location),
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        level = COALESCE($4, level),
        date = COALESCE($5, date),
        start_time = COALESCE($6, start_time),
        end_time = COALESCE($7, end_time),
        call_time = COALESCE($8, call_time),
        class_id = COALESCE($9, class_id),
        costume = COALESCE($10, costume)
        WHERE id = $11 RETURNING *;`;

        const updatedEvent = await db.query(query, [location, title, description, level, date, start_time, end_time, call_time, class_id, costume, id]);
        
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
