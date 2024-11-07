import express from "express";
import { Google } from "../controllers/auth.controller.js"; 

const router =express.Router();

router.post('/google',Google);

export default router;