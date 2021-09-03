"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        await queryInterface.createTable("comment_responses", {
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
                allowNull: true,
                defaultValue: null,
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
        await queryInterface.dropTable("comment_responses")
    }
}
