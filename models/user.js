module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
            unique: true
        },
        email: {
            type: Sequelize.STRING
        },
        emailVerified: {
            type: Sequelize.BOOLEAN
        },
        name: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING,
            unique: true
        },
        verificationCode: {
            type: Sequelize.STRING
        }
    })

    User.associate = (models) => {
        User.hasMany(models.post, { foreignKey: "userId" })
        User.hasMany(models.comment, { foreignKey: "userId" })
        User.hasMany(models.comment_response, { foreignKey: "userId" })
        User.hasMany(models.comment_like, { foreignKey: "userId" })
    }

    return User
}
