import "dotenv/config";
import nodemailer from "nodemailer";

const { MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USERNAME, MAIL_PASSWORD } = process.env;

const nodemailerConfig = {
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_SECURE,
    auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
    },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (data) => {
    const email = { ...data, from: `GoIT Node.js ${MAIL_USERNAME}` };
    return transport.sendMail(email);
};

export default sendEmail;
