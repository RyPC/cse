import express from "express";
import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp"; // TODO: replace this db with

const classVideosRouter = express.Router();
classVideosRouter.use(express.json());

classVideosRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db.query(`SELECT * FROM class_videos WHERE id = $1`, [id]);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classVideosRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM class_videos;`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classVideosRouter.post("/", async (req, res) => {
    try {
      const { title, s3_url, description, media_url, class_id } = req.body;
      
      const postData = await db.query(
        `INSERT INTO class_videos (title, s3_url, description, media_url, class_id)
         VALUES ($1, $2, $3, $4, $5) RETURNING id, title, s3_url, description, media_url, class_id;`,
        [title, s3_url, description, media_url, class_id]
      );
  
      res.status(200).json(keysToCamel(postData));
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  classVideosRouter.put("/:id", async (req, res) => {
    try {
      const { title, s3_url, description, media_url, class_id } = req.body;
      
      const updatedClassVideos = await db.query(`UPDATE class_videos
        SET title = $1, s3_url = $2, description = $3, media_url = $4, class_id = $5
        RETURNING id, title, s3_url, description, media_url, class_id;`,
      [title, s3_url, description, media_url, class_id]);
  
      res.status(200).json(keysToCamel(updatedClassVideos));
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  classVideosRouter.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const deletedClassVideos = await db.query(`DELETE FROM class_videos WHERE id = $1 RETURNING *;`, [id]);
      res.status(200).send(keysToCamel(deletedClassVideos));
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  


export { classVideosRouter };