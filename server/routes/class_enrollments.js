import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp"; // TODO: replace this db with

const classEnrollmentsRouter = express.Router();
classEnrollmentsRouter.use(express.json());

classEnrollmentsRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const classById = await db.query(
      "SELECT * FROM class_enrollments WHERE id = $1;",
      [id]
    );
    res.status(200).json(keysToCamel(classById));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classEnrollmentsRouter.get("/", async (req, res) => {
  try {
    const classById = await db.query(`SELECT * FROM class_enrollments;`);
    res.status(200).json(keysToCamel(classById));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classEnrollmentsRouter.get("/student/:student_id", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
        c.*,
        sc.date,
        sc.start_time,
        sc.end_time,
        COUNT(ce.student_id) as attendee_count
      FROM classes c
      LEFT JOIN scheduled_classes sc ON c.id = sc.class_id
      LEFT JOIN class_enrollments ce ON c.id = ce.class_id
      WHERE ce.student_id = $1
      GROUP BY c.id, sc.date, sc.start_time, sc.end_time
    `,
      [req.params.student_id]
    );

    res.json(keysToCamel(result));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

classEnrollmentsRouter.post("/", async (req, res) => {
  const { studentId, classId, attendance } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO class_enrollments (student_id, class_id, attendance) VALUES ($1, $2, $3) RETURNING id",
      [studentId, classId, attendance]
    );

    res.status(201).json({
      id: result[0].id,
      studentId: studentId,
      classId: classId,
      attendance: attendance,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { classEnrollmentsRouter };
