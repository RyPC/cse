

import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const eventEnrollmentRouter = express.Router();
eventEnrollmentRouter.use(express.json());

interface EventEnrollment {
  id: number;
  student_id: number;
  event_id: number;
  attendance: boolean;
}

interface EventEnrollmentRequest {
  student_id: number;
  event_id: number;
  attendance?: boolean;
}

// GET /
eventEnrollmentRouter.get("/", async (req, res) => {
  try {
    const events = await db.query("SELECT * FROM event_enrollments");
    res.json(keysToCamel(events) as EventEnrollment[]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET /:id
eventEnrollmentRouter.get("/:id", async (req, res) => {
  try {
    const events = await db.query("SELECT * FROM event_enrollments WHERE id = $1", [
      req.params.id,
    ]);
    // If no rows are returned, send a 404 response
    if (events.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    // Convert the snake_case keys to camelCase and send the response
    res.json(keysToCamel(events[0] as EventEnrollment));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /event-enrollments
eventEnrollmentRouter.post("/", async (req, res) => {
  try {
    // Destructure the request body
    const { student_id, event_id } = req.body as EventEnrollmentRequest;
    // Insert the new article into the database
    // Returning * will return the newly inserted row in the response

    // By default the attendance will be false as mentioned in the table
    const rows = await db.query(
      "INSERT INTO event_enrollments (student_id, event_id, attendance) VALUES ($1, $2, false) RETURNING *",
      [student_id, event_id]
    );
    // Convert the snake_case keys to camelCase and send the response with status 201 (Created)
    res.status(201).json(keysToCamel(rows[0] as EventEnrollment));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// PUT /:id
eventEnrollmentRouter.put("/:id", async (req, res) => {
  try {
    // Destructure the request body
    const { student_id, event_id, attendance } = req.body as EventEnrollmentRequest;
    // Update the article with the matching id
    const events = await db.query(
      "UPDATE event_enrollments SET student_id = $1, event_id = $2, attendance = $3 WHERE id = $4 RETURNING *",
      [student_id, event_id, attendance, req.params.id]
    );
    // If no rows are returned, send a 404 response
    if (events.length === 0) {
      // Could not find the event-enrollment with the given id
      return res.status(404).json({ error: "Event not found" });
    }
    // Convert the snake_case keys to camelCase and send the response
    res.json(keysToCamel(events[0]) as EventEnrollment);
  } catch (error) {
    // Send a 500 response with the error message
    res.status(500).json({ error: error.message });
  }
});


export default eventEnrollmentRouter;
