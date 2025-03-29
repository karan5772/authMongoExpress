import express from "express"
import { regesterUser, verifyUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/regester",regesterUser)
router.get("/verify/:token",verifyUser)

export default router;