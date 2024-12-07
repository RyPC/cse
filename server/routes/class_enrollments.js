import express from "express";

import { keysToCamel } from "../common/utils";

const classEnrollmentsRouter = express.Router();
classEnrollmentsRouter.use(express.json());

classEnrollmentsRouter.get("/class-enrollments/:id", async (req, res) => {
  try {
     const classById = await db.query(`SELECT * FROM class_enrollments WHERE ${id};`);
    res.status(200).json(classById);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classEnrollmentsRouter.get("/class-enrollments", async (req, res) => {
  try {
     const classById = await db.query(`SELECT * FROM class_enrollments;`);
    res.status(200).json(classById);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classEnrollmentsRouter.post("/class-enrollments", async (req, res) => {
  try {
    const data = {};

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { classEnrollmentsRouter };