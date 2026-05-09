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
};