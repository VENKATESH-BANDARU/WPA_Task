const bcrypt = require('bcryptjs');
const { ADMIN, EDITOR, VIEWER } = require('../config/roles');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(ADMIN, EDITOR, VIEWER),
      defaultValue: VIEWER,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    timeStamps: true
  });

  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hashSync(user.password, salt);
  });

  User.prototype.isValidPassword = async function (password) {
    return await bcrypt.compareSync(password, this.password);
  };

  return User;
};