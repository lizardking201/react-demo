module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
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
        postId: {
            type: Sequelize.INTEGER
        },
        userId: {
            type: Sequelize.INTEGER
        }
    })

    Comment.associate = (models) => {
        Comment.belongsTo(models.post, { foreignKey: "postId" })
        Comment.belongsTo(models.user, { foreignKey: "userId" })
        Comment.hasMany(models.comment_response, { foreignKey: "responseTo" })
        Comment.hasMany(models.comment_like, { foreignKey: "commentId" })
    }

    return Comment
}
