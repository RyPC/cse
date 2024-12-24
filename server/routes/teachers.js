import express from 'express';
import { keysToCamel } from '../common/utils';
import { db } from "../db/db-pgp"; // TODO: replace this db with

export const teachersRouter = express.Router();
teachersRouter.use(express.json());

teachersRouter.post("/teachers", async(req, res) => {
    try {
        const { first_name, last_name, role, user_role, email, experience } = req.params;

        await db.query(
        `
            INSERT INTO teachers(id, experience, is_activated)
            VALUES
            ($1, $2, $3, $4, $5, $6);`,
            [
                first_name,
                last_name,
                role,
                user_role,
                email,
                experience
        ],
        );
        
        res.status(200).json({
            status: "Success",
        });
    } catch (err) {
        res.status(500).json({
            status: "Failed",
            msg: err.message,
        });
    }
});