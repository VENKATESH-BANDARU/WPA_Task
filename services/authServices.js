const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const config = require('../config/config');
const emailService = require('./emailService');


class authServices {
    async register(email, password) {
        const user = await User.create({ email, password });
        const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1d' });

        await emailService.sendVerificationEmail(email, token);

        return user;
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1d' });

        return { user, token };
    }

    async verifyEmail(token) {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            throw new Error('Invalid token');
        }

        user.verified = true;
        await user.save();

        return user;
    }

    async resetPassword(email) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error('Email not found');
        }

        const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '1h' });

        await emailService.sendPasswordResetEmail(email, token);

        return token;
    }

    async updatePassword(token, newPassword) {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            throw new Error('Invalid token');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return user;
    }
}

module.exports = new authServices();