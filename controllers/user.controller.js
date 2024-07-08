const { User } = require('../models/index.model');

class Users {
    async getAlluser(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message });
        }
    }

    async singleUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await user.update(req.body);
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
    async deleteUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await user.destroy();
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new Users();