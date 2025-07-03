import express from 'express';
import {authController} from "../controllers/authController";

const authRouters = express.Router();

authRouters.post("/login", authController.login);

export default authRouters;