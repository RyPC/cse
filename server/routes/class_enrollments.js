import express from "express";
import { format } from "mysql";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp"; // TODO: replace this db with

const classEnrollmentsRouter = express.Router();
classEnrollmentsRouter.use(express.json());

classEnrollmentsRouter.get("/:id", async (req, res) => {
  try {
    const classById = await db.query(
      `SELECT * FROM class_enrollments WHERE ${id};`
    );
    res.status(200).json(classById);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classEnrollmentsRouter.get("/", async (req, res) => {
  try {
    const classById = await db.query(`SELECT * FROM class_enrollments;`);
    res.status(200).send(classById);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classEnrollmentsRouter.post("/class_enrollments", async (req, res) => {
  const { student_id, class_id, enrollment_date } = req.body;
  try {
    const createStudent = await db.query(
      "INSERT INTO student (id, level, date) VALUES ($1, $2, $3)",
      [student_id, class_id, enrollment_date]
    );

    const recordId = await db.query(
      `SELECT id FROM class_enrollments WHERE student_id='${student_id}' AND class_id='${class_id}'`
    );

    res.status(200).send({
      id: recordId,
      student_id: student_id,
      class_id: class_id,
      enrollment_date: enrollment_date,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { classEnrollmentsRouter };
