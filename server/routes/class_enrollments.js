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

classEnrollmentsRouter.put("/:student_id", async (req, res) => {
  const student_id = req.params.student_id;
  const { class_id, attendance } = req.body;
  try {
    const data = await db.query(
      `UPDATE class_enrollments
       SET attendance = $1
       WHERE student_id = $2 AND class_id = $3
      `,
      [attendance, student_id, class_id]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { classEnrollmentsRouter };
