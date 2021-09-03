module.exports = (sequelize, Sequelize) => {
    const CommentResponse = sequelize.define("comment_response", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
            unique: true
        },
        message: {
            type: Sequelize.TEXT
        },
        responseTo: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        userId: {
            type: Sequelize.INTEGER
        }
    })

    CommentResponse.associate = (models) => {
        CommentResponse.belongsTo(models.user, { foreignKey: "userId" })
        CommentResponse.belongsTo(models.comment, { foreignKey: "responseTo" })
        CommentResponse.hasMany(models.comment_like, { foreignKey: "responseId" })
    }

    return CommentResponse
}
