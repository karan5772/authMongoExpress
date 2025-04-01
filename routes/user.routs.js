import express from "express"
import { regesterUser, verifyUser,login } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/regester",regesterUser)
router.get("/verify/:token",verifyUser)
router.post("/regester",login)

export default router;