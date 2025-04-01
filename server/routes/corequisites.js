import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const corequisitesRouter = express.Router();

corequisitesRouter.use(express.json());

corequisitesRouter.get("/", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM corequisites;
        `);

        res.json(keysToCamel(result));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

corequisitesRouter.get("/:id", async (req, res) => {
    const classId = req.params.id;

    try {
        const result = await db.query(`
            SELECT * FROM corequisites WHERE class_id = $1;
        `, [classId]);
  
      res.json(keysToCamel(result));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

corequisitesRouter.put("/:class_id/:event_id", async (req, res) => {
    const { class_id, event_id } = req.params;

    try { // if class id doesnt exist yet, create new entry, else update
        const result = await db.query(`
            INSERT INTO corequisites (class_id, event_id)
            VALUES ($1, $2)
            ON CONFLICT (class_id, event_id) DO UPDATE
            SET event_id = EXCLUDED.event_id
            RETURNING *;
        `, [class_id, event_id]);
  
      res.json(keysToCamel(result));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

export { corequisitesRouter };
