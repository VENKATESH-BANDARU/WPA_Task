const { User } = require('../models/index.model');

module.exports = (roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.user.id);
            if (roles.includes(user.role)) {
                return next();
            }

            res.status(403).json({ message: 'Access denied' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
};