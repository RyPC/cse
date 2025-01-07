import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const articlesRouter = express.Router();
articlesRouter.use(express.json());

interface Article {
  id: number;
  s3_url: string;
  description: string;
  media_url: string;
}

interface ArticleRequest {
  s3_url?: string;
  description?: string;
  media_url?: string;
}

// GET /articles/:id
articlesRouter.get("/:id", async (req, res) => {
  try {
    // Select rows where the id matches the id in the request parameters
    const rows = await db.query("SELECT * FROM articles WHERE id = $1", [
      req.params.id,
    ]);
    // If no rows are returned, send a 404 response
    if (rows.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }
    // Convert the snake_case keys to camelCase and send the response
    res.status(200).json(keysToCamel(rows[0] as Article));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /articles
articlesRouter.get("/", async (req, res) => {
  try {
    // Select all rows from the articles table
    const rows = await db.query("SELECT * FROM articles");
    // Convert the snake_case keys to camelCase and send the response
    res.status(200).json(keysToCamel(rows) as Article[]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /articles
articlesRouter.post("/", async (req, res) => {
  try {
    // Destructure the request body
    const { s3_url, description, media_url } = req.body as ArticleRequest;
    // Insert the new article into the database
    // Returning * will return the newly inserted row in the response
    const rows = await db.query(
      "INSERT INTO articles (s3_url, description, media_url) VALUES ($1, $2, $3) RETURNING *",
      [s3_url, description, media_url]
    );
    // Convert the snake_case keys to camelCase and send the response with status 201 (Created)
    res.status(201).json(keysToCamel(rows[0] as Article));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /articles/:id
articlesRouter.put("/:id", async (req, res) => {
  try {
    // Destructure the request body
    const { s3_url, description, media_url } = req.body as ArticleRequest;
    // Update the article with the matching id
    const rows = await db.query(
      "UPDATE articles SET s3_url = $1, description = $2, media_url = $3 WHERE id = $4 RETURNING *",
      [s3_url, description, media_url, req.params.id]
    );
    // If no rows are returned, send a 404 response
    if (rows.length === 0) {
      // Could not find the article with the given id
      return res.status(404).json({ error: "Article not found" });
    }
    // Convert the snake_case keys to camelCase and send the response
    res.status(200).json(keysToCamel(rows[0]) as Article);
  } catch (error) {
    // Send a 500 response with the error message
    res.status(500).json({ error: error.message });
  }
});

// DELETE /articles/:id
articlesRouter.delete("/:id", async (req, res) => {
  try {
    // Delete the article with the matching id
    const rows = await db.query(
      "DELETE FROM articles WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    // If no rows are returned, send a 404 response
    if (rows.length === 0) {
      // Could not find the article with the given id
      return res.status(404).json({ error: "Article not found" });
    }
    // Convert the snake_case keys to camelCase and send the response
    res.status(200).json(keysToCamel(rows[0] as Article));
  } catch (error) {
    // Send a 500 response with the error message
    res.status(500).json({ error: error.message });
  }
});


// Export the router made to handle these new routes
export default articlesRouter;
