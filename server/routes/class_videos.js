import express from "express";
import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

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
    const { title, s3Url, description, mediaUrl, classId } = req.body;
    
    const postData = await db.query(
      `INSERT INTO class_videos (title, s3_url, description, media_url, class_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING id, title, s3_url, description, media_url, class_id;`,
      [title, s3Url, description, mediaUrl, classId]
    );

    res.status(200).json(keysToCamel(postData)); //is this supposed to be .send instead?
  } catch (err) {
    res.status(500).send(err.message);
  }
});

classVideosRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, s3Url, description, mediaUrl, classId } = req.body;

    const query = `UPDATE class_videos SET
    title = COALESCE($1, title),
    s3_url = COALESCE($2, s3_url),
    description = COALESCE($3, description),
    media_url = COALESCE($4, media_url),
    class_id = COALESCE($5, class_id)
    WHERE id = $6 RETURNING *;`;

    const { count } = (
      await db.query(`SELECT COUNT(*) FROM class_videos WHERE id = $1`, [id])
    )[0];

    if(parseInt(count) === 1) {
      const updatedClassVideos = await db.query(query, [title, s3Url, description, mediaUrl, classId, id]);
      res.status(200).send(keysToCamel(updatedClassVideos)); 
    } else {
      res.status(400).send("Video with provided id not found");
    }
  }
  catch (err) {
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