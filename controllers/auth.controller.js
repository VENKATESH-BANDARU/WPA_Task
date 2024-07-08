const { User } = require('../models/index.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const emailService = require('../services/emailServices');

class Auth {
    async userRegister(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.create({ email, password });
            const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1d' });

            emailService.sendVerificationEmail(user.email, token);

            res.status(201).json({ message: 'User registered. Check your email to verify your account.' });
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message });
        }
    }

    async userLogin(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            if (!user || !(await user.isValidPassword(password))) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            if (user && user.verified === false) {
                return res.status(401).json({ message: "Email is not verified" });
            }

            const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1d' });

            res.json({ token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async verifyEmail(req, res) {
        try {
            const { token } = req.params;
            const decoded = jwt.verify(token, config.jwtSecret);

            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            user.verified = true;
            await user.save();

            res.json({ message: 'Email verified successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async resetPassword(req, res) {
        const { email } = req.body;

        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({ message: 'Email not found' });
            }

            const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1h' });

            emailService.sendPasswordResetEmail(user.email, token);

            res.json({ message: 'Check your email for reset instructions' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updatePassword(req, res) {
        const { token, newPassword } = req.body;

        try {
            const decoded = jwt.verify(token, config.jwtSecret);

            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            user.password = hashedPassword;
            await user.save();

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new Auth();