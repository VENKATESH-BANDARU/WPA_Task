const Sequelize = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.development);

const User = require('./user.model')(sequelize, Sequelize);
const Post = require('./post.model')(sequelize, Sequelize);
const Subscribe = require('./subscribe.model')(sequelize, Sequelize);

User.hasMany(Subscribe, { foreignKey: 'userId' });
Subscribe.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Subscribe, { foreignKey: 'postId' });
Subscribe.belongsTo(Post, { foreignKey: 'postId' });

module.exports = {
    sequelize,
    User,
    Post,
    Subscribe,
};