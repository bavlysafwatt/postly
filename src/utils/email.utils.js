const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.from = `Postly <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendinBlue',
                auth: {
                    user: process.env.LOGIN_NAME,
                    pass: process.env.SMTP_KEY
                }
            });
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(subject, html) {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html)
        };

        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        const subject = 'Welcome to Postly 🎉';

        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Welcome to Postly, ${this.firstName}! 👋</h2>
                
                <p>We're excited to have you on board.</p>
                
                <p>
                    Postly is your simple and powerful social media platform to help you stay connected,
                    engaged, and in control of your online presence.
                </p>

                <p>
                    Start managing your posts now:
                </p>

                <p>If you have any questions, feel free to reach out anytime.</p>

                <p>Happy posting 🚀<br/>— The Postly Team</p>
            </div>
        `;

        await this.send(subject, html);
    }

    async sendResetPassword(otp) {
        const subject = 'Reset Your Postly Password 🔐';

        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Password Reset Request 🔐</h2>

                <p>Hi ${this.firstName},</p>

                <p>
                    We received a request to reset your Postly password.
                    Use the verification code below to continue:
                </p>

                <div style="
                    background-color: #f5f5f5;
                    padding: 15px 25px;
                    text-align: center;
                    margin: 20px 0;
                    border-radius: 8px;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    color: #4CAF50;
                ">
                    ${otp}
                </div>

                <p>
                    This code will expire shortly. If you didn't request a
                    password reset, you can safely ignore this email.
                </p>

                <p>
                    For your security, never share this code with anyone.
                </p>

                <p>
                    Best regards,<br/>
                    — The Postly Team
                </p>
            </div>
        `;

        await this.send(subject, html);
    }
};