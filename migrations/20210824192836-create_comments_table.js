"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable("comments", {
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
            },
            // Timestamps
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE
        })
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */

        // Drop tables with a foriegn key constraint first
        await queryInterface.dropTable("comment_responses")
        await queryInterface.dropTable("comment_likes")

        // queryInterface.removeConstraint("comment", constraintName)
        await queryInterface.dropTable("comments")
    }
}
