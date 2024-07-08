const Sequelize = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.development);

const User = require('./user.model')(sequelize, Sequelize);
const Post = require('./post.model')(sequelize, Sequelize);

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    User,
    Post,
};