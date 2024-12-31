import express from "express";
import { format } from "mysql";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp"; // TODO: replace this db with

const classEnrollmentsRouter = express.Router();
classEnrollmentsRouter.use(express.json());

classEnrollmentsRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const classById = await db.query(
      `SELECT * FROM class_enrollments WHERE id = ${id};`
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

classEnrollmentsRouter.post("/", async (req, res) => {
  const { studentId, classId, attendance } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO class_enrollments (student_id, class_id, attendance) VALUES ($1, $2, $3) RETURNING id",
      [studentId, classId, attendance]
    );

    res.status(200).send({
      id: result[0].id,
      student_id: studentId,
      class_id: classId,
      attendance: attendance,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { classEnrollmentsRouter };
