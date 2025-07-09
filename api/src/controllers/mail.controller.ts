import { Router } from "express";
import Controller from "../interfaces/controller_interface";
import nodemailer from "nodemailer";
import { LogService } from "../services/log.service";

const { GMAIL_USER = "planitcards@gmail.com", GMAIL_PASS = "zbfv vihy lmph dcfc" } = process.env;


export default class MailController implements Controller {
    public router = Router();

    private htmlTemplate = (name: string, link: string) => {
        return `
            <div style="font-family: Arial, sans-serif; padding: 30px; color: #ddd;">
                <div style="max-width: 600px; margin: auto; background: #18181b; border-radius: 10px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <h2 style="color: #ccc;">Welcome to <span style="color:#fff;">PlanIt</span>!</h2>
                <hr>  
                <p>Hi <strong>${name}</strong>,</p>
                <p style="color: #ddd;">Thanks for signing up! To get started and join the game, please confirm your email address by clicking the button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${link}" 
                    style="background-color: #187236ac; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                    Confirm Your Account
                    </a>
                </div>

                <p style="color: #ddd;">If you didn’t sign up for PlanIt, you can safely ignore this email.</p>

                <hr style="margin: 40px 0;" />
                <p style="font-size: 12px; color: #ddd;">
                    This is an automated message from PlanIt – please do not reply.<br>
                    Need help? Visit our <a href="https://planit.cards/help" style="color: #2e86de;">Help Center</a>.
                </p>
                </div>
            </div>
            `
    }


    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS
        }
    })


    constructor() {
    }

    public sendMail = async (to: string, text: string, subject: string, code: string) => {

        const hex = Buffer.from(text).toString('hex');

        const link = `http://localhost:3000/verify/${hex}/${code}`;

        try {
            await this.transporter.sendMail({
                from: GMAIL_USER,
                to: to,
                subject: subject,
                html: this.htmlTemplate(text, link),
            }, function (error) {
                if (error) {
                    console.log("Error: ", error);
                }
                new LogService().consoleLog('Registration email successfully sent', 'EmailService');
            }
            );
            return true;
        } catch {
            return false;
        }
    }



}
