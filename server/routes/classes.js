import express from "express";
import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp"

const classesRouter = express.Router();
classesRouter.use(express.json());

classesRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(`SELECT * FROM classes WHERE id = $1;`, [id]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.get("/", async (req, res) => {
    try {
      const data = await db.query(`SELECT * FROM classes;`);
  
      res.status(200).json(keysToCamel(data));
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

classesRouter.post("/", async (req, res) => {
  try {
    const { title, description, location, capacity, level, costume } = req.body;

    const data = await db.query(`
        INSERT INTO classes (title, description, location, capacity, level, costume)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, 
        [title, description, location, capacity, level, costume]
    );
    
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classesRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, location, capacity, level, costume } = req.body;

        const query = `UPDATE CLASSES SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        location = COALESCE($3, location),
        capacity = COALESCE($4, capacity),
        level = COALESCE($5, level),
        costume = COALESCE($6, costume)
        WHERE id = $7 RETURNING *;`;

        const data = await db.query(query, [title, description, location, capacity, level, costume, id]);
    
        res.status(200).json(keysToCamel(data));
    } catch (err) {
      res.status(500).send(err.message);
    }
});

export { classesRouter };
