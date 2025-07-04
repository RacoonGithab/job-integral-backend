import nodemailer from "nodemailer";
import {env} from "./secrets";

export const mailTransporter = nodemailer.createTransport({
    host: env.SMTP_EMAIL_HOST,
    port: env.SMTP_EMAIL_PORT,
    secure: false,
    auth: {
        user: env.EMAIL_HOST_USER,
        pass: env.EMAIL_HOST_PASSWORD,
    },
});