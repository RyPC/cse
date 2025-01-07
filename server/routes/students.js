import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const studentsRouter = express.Router();
studentsRouter.use(express.json());

studentsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await db.query(
      `SELECT u.id, u.first_name, u.last_name, u.role, u.user_role, u.email, u.firebase_uid, s.level
       FROM users u
       JOIN students s ON u.id = s.id
       WHERE u.id = $1`,
      [id]
    );

    if (student.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(keysToCamel(student[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

studentsRouter.get("/", async (req, res) => {
  try {
    const students = await db.query(
      `SELECT u.id, u.first_name, u.last_name, u.role, u.user_role, u.email, u.firebase_uid, s.level
       FROM users u
       JOIN students s ON u.id = s.id`
    );

    res.status(200).json(keysToCamel(students));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

studentsRouter.post("/", async (req, res) => {
  try {
    const { first_name, last_name, role, user_role, email, level, firebase_uid } = req.body;

    const newUser = await db.query(
      `INSERT INTO users (first_name, last_name, role, user_role, email, firebase_uid)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, role, user_role, email, firebase_uid;`,
      [first_name, last_name, role, user_role, email, firebase_uid]
    );

    const userId =newUser[0].id;
    console.log(userId)

    const newStudent = await db.query(
      `INSERT INTO students (id, level)
       VALUES ($1, $2)
       RETURNING id, level;`,
      [userId, level]
    );

    res.status(201).json(keysToCamel({ ...newUser[0], ...newStudent[0] }));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

studentsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { level } = req.body;

    const updatedStudent = await db.query(
      `UPDATE students
       SET level = $1
       WHERE id = $2
       RETURNING id, level;`,
      [level, id]
    );

    if (updatedStudent.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(keysToCamel(updatedStudent[0]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

studentsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await db.query(
      `DELETE FROM students
       WHERE id = $1
       RETURNING id;`,
      [id]
    );



    if (deletedStudent.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    await db.query(
      `DELETE FROM users
       WHERE id = $1;`,
      [id]
    );

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { studentsRouter };
