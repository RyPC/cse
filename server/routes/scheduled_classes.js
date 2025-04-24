import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const scheduledClassesRouter = express.Router();
scheduledClassesRouter.use(express.json());

scheduledClassesRouter.get("/teachers/count", async (req, res) => {
  const { search } = req.query;

  try {
    const query = `
      SELECT COUNT(*) AS count
      FROM (
        SELECT sc.date, c.id
        FROM scheduled_classes sc
        LEFT JOIN classes_taught ct ON ct.class_id = sc.class_id
        LEFT JOIN teachers t ON t.id = ct.teacher_id
        LEFT JOIN users u ON u.id = t.id
        LEFT JOIN classes c ON c.id = sc.class_id
        ${search ? "WHERE c.title ILIKE $1" : ""}
        GROUP BY c.id, sc.date
      ) AS subq;
    `;

    const data = await db.query(query, [`%${search}%`]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

scheduledClassesRouter.get("/teachers", async (req, res) => {
  const { search, page } = req.query;
  const pageNum = page ? parseInt(page) : 0;

  try {
    const query = `
      SELECT sc.date,c.*, 
      COALESCE(STRING_AGG(u.first_name || ' ' || u.last_name, ', '),'') AS teachers
      FROM scheduled_classes sc
      LEFT JOIN classes_taught ct ON ct.class_id = sc.class_id
      LEFT JOIN teachers t ON t.id = ct.teacher_id
      LEFT JOIN users u ON u.id = t.id
      LEFT JOIN classes c ON c.id = sc.class_id
      ${search ? "WHERE c.title ILIKE $1" : ""}
      GROUP BY c.id, sc.date
      ORDER BY LOWER(c.title) ASC
      LIMIT 10 OFFSET $2;
    `;

    const data = await db.query(query, [`%${search}%`, 10 * pageNum]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

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
      return res
        .status(400)
        .send(
          "Invalid PUT request, please enter required `class_id` and `date` parameters"
        );

    const query = `UPDATE scheduled_classes SET
        start_time = COALESCE($1, start_time),
        end_time = COALESCE($2, end_time)
        WHERE class_id = $3 and date = $4
        RETURNING *;`;

    const data = await db.query(query, [start_time, end_time, class_id, date]);

    if (data.rowCount === 0)
      return res.status(404).send("Scheduled class not found");

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

scheduledClassesRouter.delete("/:classId/:classDate", async (req, res) => {
  try {
    const { classId, classDate } = req.params;

    const result = await db.query(
      `DELETE FROM scheduled_classes 
       WHERE class_id = $1
       AND date = $2
       RETURNING *;`,
      [classId, classDate]
    );

    res.status(200).json({
      message: `Deleted ${result.length} scheduled classes for class ID ${classId}`,
      deleted: keysToCamel(result),
    });
  } catch (err) {
    console.error("Error deleting scheduled classes:", err);
    res.status(500).send(err.message);
  }
});

scheduledClassesRouter.delete("/:classId", async (req, res) => {
  try {
    const { classId } = req.params;

    const result = await db.query(
      `DELETE FROM scheduled_classes 
       WHERE class_id = $1
       RETURNING *;`,
      [classId]
    );

    res.status(200).json({
      message: `Deleted ${result.length} scheduled classes for class ID ${classId}`,
      deleted: keysToCamel(result),
    });
  } catch (err) {
    console.error("Error deleting scheduled classes:", err);
    res.status(500).send(err.message);
  }
});

export { scheduledClassesRouter };
