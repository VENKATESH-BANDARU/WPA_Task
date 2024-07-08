module.exports = (sequelize, DataTypes) => {
    const Subscribe = sequelize.define('Subscribe', {
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });

    return Subscribe;
};