import express from "express";

import { getS3UploadURL } from "../common/s3";

const s3Router = express.Router();
s3Router.use(express.json());

// GET /s3/url
s3Router.get("/url", async (req, res) => {
  try {
    const uploadURL = await getS3UploadURL();
    res.status(200).json({ url: uploadURL });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the router made to handle these new routes
export { s3Router };
