import express from "express";
import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp"

const reviewsRouter = express.Router();
reviewsRouter.use(express.json());

reviewsRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM reviews`);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

reviewsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(`SELECT * FROM reviews WHERE id = $1;`, [id]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

reviewsRouter.get("/class/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(`SELECT * FROM reviews WHERE class_id = $1;`, [id]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

reviewsRouter.get("/student/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(`SELECT * FROM reviews WHERE student_id = $1;`, [id]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

reviewsRouter.post("/", async (req, res) => {
  // TODO
});

reviewsRouter.put("/", async (req, res) => {
  try {
    const { class_id, student_id, rating, review } = req.body;
    if (!class_id || !student)
        res.status(500).send("Invalid PUT request, please enter required `student_id` and `class_id` parameters")
    
    const data = await db.query(
        `UPDATE scheduled_classes SET
            ${ rating ? 'rating = $(rating), ' : ''}
            ${ review ? 'review = $(review), ' : ''}
            class_id = '${class_id}',
            student_id = '${student_id}'
        WHERE class_id = '${class_id}' and student_id = '${student_id}'
        RETURNING *;`,
        {class_id, student_id, rating, review}
    );

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

reviewsRouter.delete("/", async (req, res) => {
  //TODO
});

export { reviewsRouter };
