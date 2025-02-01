import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const scheduledClassesRouter = express.Router();
scheduledClassesRouter.use(express.json());

scheduledClassesRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(
      `SELECT * FROM scheduled_classes WHERE class_id = $1;`,
      [id]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

scheduledClassesRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM scheduled_classes;`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

scheduledClassesRouter.post("/", async (req, res) => {
  try {
    const { class_id, date, start_time, end_time } = req.body;

    const data = await db.query(
      `
        INSERT INTO scheduled_classes (class_id, date, start_time, end_time)
        VALUES ($1, $2, $3, $4) RETURNING *;`,
      [class_id, date, start_time, end_time]
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

scheduledClassesRouter.put("/", async (req, res) => {
  try {
    const { class_id, date, start_time, end_time } = req.body;

    if (!class_id || !date)
      res
        .status(500)
        .send(
          "Invalid PUT request, please enter required `class_id` and `date` parameters"
        );

    const data = await db.query(
      `UPDATE scheduled_classes SET
                ${start_time ? "start_time = $(start_time), " : ""}
                ${end_time ? "end_time = $(end_time), " : ""}
                date = '${date}',
                class_id = '${class_id}'
            WHERE class_id = '${class_id}' and date = '${date}'
            RETURNING *;`,
      { class_id, date, start_time, end_time }
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { scheduledClassesRouter };
