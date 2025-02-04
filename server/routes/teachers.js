import express from 'express';
import { keysToCamel } from '../common/utils';
import { db } from "../db/db-pgp"; // TODO: replace this db with

export const teachersRouter = express.Router();
teachersRouter.use(express.json());

// Postman Screenshot: https://img001.prntscr.com/file/img001/r7f400d1Q_K4fpLr42zpxg.png
teachersRouter.get("/:id", async(req, res) => {
    try {
        const teacherId = req.params.id

        const teacher = await db.query(
            "SELECT * FROM Teachers INNER JOIN Users ON Users.id = Teachers.id WHERE Teachers.id = $1",
            [teacherId]
        )

        res.status(200).json(keysToCamel(teacher[0]));
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "Failed",
            msg: err.message,
        });
    }
});

// Postman Screenshot: https://img001.prntscr.com/file/img001/KA0s8VN8RrGbU67hH6rznA.png
teachersRouter.get("/", async(req, res) => {
    try {
        const teacher = await db.query(
            "SELECT * FROM Teachers INNER JOIN Users ON Users.id = Teachers.id"
        )

        res.status(200).json(keysToCamel(teacher));
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "Failed",
            msg: err.message,
        });
    }
});

// Postman Screenshot: https://img001.prntscr.com/file/img001/KS97e25SRRSSCmbls-aKIg.png
teachersRouter.get("/classes/:id", async(req, res) => {
    try {
        const teacherId = req.params.id

        const classes = await db.query(
            "SELECT classes.id, classes.title FROM classes INNER JOIN classes_taught ON classes_taught.class_id = classes.id WHERE classes_taught.teacher_id = $1",
            [teacherId]
        )

        res.status(200).json(keysToCamel(classes))

    } catch(err) {
        console.log(err)
        res.status(500).json({
            status: "Failed",
            msg: err.message,
        });
    }
})

// Postman Screenshot: https://img001.prntscr.com/file/img001/aaW5w8onRLmmqpuvSwdTWQ.png
teachersRouter.post("/", async(req, res) => {
    try {
        const { firstName, lastName, email, experience, firebaseUid } = req.body;

        await db.query(
            "INSERT INTO Users (first_name, last_name, user_role, email, firebase_uid) VALUES ($1, $2, $3, $4, $5)",
            [firstName, lastName, "teacher", email, firebaseUid]
        )

        const user = await db.query(
            "SELECT * FROM Users WHERE email = $1",
            [email]
        )

        const teacherId = keysToCamel(user)[0].id;

        const teacher = await db.query(
            `WITH new_teacher as (
                INSERT INTO Teachers (id, experience, is_activated) OVERRIDING SYSTEM VALUE VALUES ($1, $2, false) RETURNING *
            ) SELECT * FROM new_teacher INNER JOIN Users ON Users.id = new_teacher.id`,
            [teacherId, experience]
        )

        res.status(201).json(keysToCamel(teacher)[0])

    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "Failed",
            msg: err.message,
        });
    }
});

// Postman Screenshot: https://img001.prntscr.com/file/img001/GtiUoMMlQz-6eT1Qfq1K9Q.png
teachersRouter.put("/:id", async(req, res) => {
    try {
        const { experience, isActivated } = req.body;
        const teacherId = req.params.id

        const updatedTeacher = await db.query(
            `UPDATE teachers SET
              experience = COALESCE($1, experience),
              is_activated = COALESCE($2, is_activated)
              WHERE id = $3 RETURNING *;
            `,
            [experience, isActivated, teacherId]
        );

        res.status(200).json(keysToCamel(updatedTeacher)[0])
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "Failed",
            msg: err.message,
        });
    }
})

// Postman Screenshot: https://img001.prntscr.com/file/img001/tJLH9FmfS1i7NSh8OM0OHA.png
teachersRouter.delete("/:id", async(req, res) => {
    try {
        const teacherId = req.params.id

        const teacher = await db.query(
            `WITH deleted_teacher AS (
                DELETE FROM Teachers WHERE id = $1 RETURNING *
            ) SELECT * FROM deleted_teacher INNER JOIN Users ON Users.id = deleted_teacher.id`,
            [teacherId]
        )

        res.status(200).json(keysToCamel(teacher[0]));

    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "Failed",
            msg: err.message,
        });
    }
})
