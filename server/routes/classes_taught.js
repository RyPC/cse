import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../server/db";

const classesTaughtRouter = express.Router();
classesTaughtRouter.use(express.json());

// Returns all the data from the classes-taught table
classesTaughtRouter.get("/", async (req, res) => {
  try {
    // Query database
    const query = `SELECT * FROM classes-taught;`;

    const allClassesTaught = await db.query(query);
    res.status(200).json(keysToCamel(allClassesTaught));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Creates a new classes-taught entry in the classes taught table
classesTaughtRouter.post("/", async (req, res) => {
  try {
    // Destructure req.body
    const { teacher_id, class_id } = req.body;

    // Construct query with parameters
    const query = `INSERT INTO classes-taught (teacher_id, class_id) VALUES ($1, $2);`;
    const params = [teacher_id, class_id];

    await db.query(query, params);

    res.status(200).send({
      teacher_id: teacher_id,
      class_id: class_id,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export { classesTaughtRouter };
