module.exports = (sequelize, Sequelize) => {
    const CommentLike = sequelize.define("comment_like", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
            unique: true
        },
        commentId: {
            type: Sequelize.INTEGER
        },
        userId: {
            type: Sequelize.INTEGER
        }
    })

    CommentLike.associate = (models) => {
        CommentLike.belongsTo(models.comment, { foreignKey: "commentId" })
        CommentLike.belongsTo(models.comment_response, { foreignKey: "responseId" })
        CommentLike.belongsTo(models.user, { foreignKey: "userId" })
    }

    return CommentLike
}
