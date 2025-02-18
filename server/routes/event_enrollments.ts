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
  student_id?: number;
  event_id?: number;
  attendance?: boolean;
}

// GET /
eventEnrollmentRouter.get("/", async (req, res) => {
  try {
    const events = await db.query("SELECT * FROM event_enrollments");
    res.status(200).json(keysToCamel(events) as EventEnrollment[]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:id
eventEnrollmentRouter.get("/:id", async (req, res) => {
  try {
    const events = await db.query(
      "SELECT * FROM event_enrollments WHERE id = $1",
      [req.params.id]
    );
    // If no rows are returned, send a 404 response
    if (events.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    // Convert the snake_case keys to camelCase and send the response
    res.status(200).json(keysToCamel(events[0] as EventEnrollment));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

eventEnrollmentRouter.get("/student/:student_id", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
        e.*,
        COUNT(ee.student_id) as attendee_count
      FROM events e
      LEFT JOIN event_enrollments ee ON e.id = ee.event_id
      WHERE ee.student_id = $1
      GROUP BY e.id
    `,
      [req.params.student_id]
    );

    res.json(keysToCamel(result));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /event-enrollments
eventEnrollmentRouter.post("/", async (req, res) => {
  try {
    // Destructure the request body
    const { student_id, event_id } = req.body as EventEnrollmentRequest;
    // mathing sql schema
    if (!student_id || !event_id) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

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
    const { id } = req.params;
    const { student_id, event_id, attendance } =
      req.body as EventEnrollmentRequest;

    const query = `
      UPDATE event_enrollments SET
      student_id = COALESCE($1, student_id),
      event_id = COALESCE($2, event_id),
      attendance = COALESCE($3, attendance)
      WHERE id = $4 RETURNING *;`;

    // Update the article with the matching id
    const events = await db.query(query, [
      student_id,
      event_id,
      attendance,
      id,
    ]);

    // If no rows are returned, send a 404 response
    if (events.length === 0) {
      // Could not find the event-enrollment with the given id
      return res.status(404).json({ error: "Event not found" });
    }
    // Convert the snake_case keys to camelCase and send the response
    res.status(200).json(keysToCamel(events[0]) as EventEnrollment);
  } catch (error) {
    // Send a 500 response with the error message
    res.status(500).json({ error: error.message });
  }
});

export { eventEnrollmentRouter };
