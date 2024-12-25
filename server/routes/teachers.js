import express from 'express';
import { keysToCamel } from '../common/utils';
import { db } from "../db/db-pgp"; // TODO: replace this db with

export const teachersRouter = express.Router();
teachersRouter.use(express.json());

// Postman Screenshot: https://img001.prntscr.com/file/img001/r7f400d1Q_K4fpLr42zpxg.png
teachersRouter.get("/:id", async(req, res) => {
    try {
        const id = req.params.id

        const teacher = await db.query(
            "SELECT * FROM Teachers INNER JOIN Users ON Users.id = Teachers.id WHERE Teachers.id = $1",
            [id]
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

// Postman Screenshot: https://img001.prntscr.com/file/img001/aaW5w8onRLmmqpuvSwdTWQ.png
teachersRouter.post("", async(req, res) => {
    try {
        const { firstName, lastName, role, userRole, email, experience } = req.body;
        const firebaseUid = Math.random().toString(36).slice(2, 7) // TODO: Need to obtain the actual firebaseUid

        await db.query(
            "INSERT INTO Users (first_name, last_name, role, user_role, email, firebase_uid) VALUES ($1, $2, $3, $4, $5, $6)",
            [firstName, lastName, role, userRole, email, firebaseUid]
        )

        const user = await db.query(
            "SELECT * FROM Users WHERE email = $1",
            [email]
        )
        
        const userId = keysToCamel(user)[0].id;

        await db.query(
            "INSERT INTO Teachers (id, experience, is_activated) OVERRIDING SYSTEM VALUE VALUES ($1, $2, false)",
            [userId, experience]
        )
        
        res.redirect(`/teachers/${userId}`)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "Failed",
            msg: err.message,
        });
    }
});