import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp"; // TODO: replace this db with

export const tagsRouter = express.Router();
tagsRouter.use(express.json());

tagsRouter.get("/", async (req, res) => {
  try {
    const tags = await db.query(
      `SELECT * FROM tags;`
    );
    res.status(200).json(keysToCamel(tags));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Failed",
      msg: err.message,
    });
  }
});
