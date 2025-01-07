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
teachersRouter.post("", async(req, res) => {
    try {
        const { firstName, lastName, role, userRole, email, experience, firebaseUid } = req.body;

        await db.query(
            "INSERT INTO Users (first_name, last_name, role, user_role, email, firebase_uid) VALUES ($1, $2, $3, $4, $5, $6)",
            [firstName, lastName, role, userRole, email, firebaseUid]
        )

        const user = await db.query(
            "SELECT * FROM Users WHERE email = $1",
            [email]
        )
        
        const teacherId = keysToCamel(user)[0].id;

        await db.query(
            "INSERT INTO Teachers (id, experience, is_activated) OVERRIDING SYSTEM VALUE VALUES ($1, $2, false)",
            [teacherId, experience]
        )
        
        res.redirect(`/teachers/${teacherId}`)

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

        await db.query(
            "UPDATE Teachers SET experience = $1, is_activated = $2 WHERE id = $3",
            [experience, isActivated, teacherId]
        )
        
        res.status(200).json({
            "id": teacherId,
            "experience": experience,
            "isActivated": isActivated
        })
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
            "SELECT * FROM Teachers INNER JOIN Users ON Users.id = Teachers.id WHERE Teachers.id = $1",
            [teacherId]
        )

        await db.query(
            "DELETE FROM Teachers WHERE id = $1",
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
