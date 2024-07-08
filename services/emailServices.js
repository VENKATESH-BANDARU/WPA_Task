const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
    service: config.emailConfig.service,
    auth: {
        user: config.emailConfig.auth.user,
        pass: config.emailConfig.auth.pass,
    },
});


class emailServices {
    async sendVerificationEmail(email, token) {
        const verificationUrl = `http://localhost:3000/verifyemail/${token}`;

        await transporter.sendMail({
            from: '"WPA Task" <no-reply@app.com>',
            to: email,
            subject: 'Email Verification',
            html: `<p>Please verify your email by clicking on the link below and copy the token</p><p><a href="${verificationUrl}">Verify Email</a></p>`,
        });
    }

    async sendPasswordResetEmail(email, token) {
        const resetUrl = `http://localhost:3000/reset/password/${token}`;

        await transporter.sendMail({
            from: '"WPA Task" <no-reply@app.com>',
            to: email,
            subject: 'Password Reset',
            html: `<p>Reset your password by clicking on the link below and copy the token</p><p><a href="${resetUrl}">Reset Password</a></p>`,
        });
    }
}

module.exports = new emailServices();