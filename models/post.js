module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
            unique: true
        },
        description: {
            type: Sequelize.TEXT
        },
        title: {
            type: Sequelize.STRING
        },
        userId: {
            allowNull: false,
            type: Sequelize.INTEGER
        }
    })

    Post.associate = (models) => {
        Post.hasMany(models.comment, { foreignKey: "postId" })
        Post.belongsTo(models.user, { foreignKey: "userId" })
    }

    return Post
}
