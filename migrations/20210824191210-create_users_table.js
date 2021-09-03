"use strict"

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        await queryInterface.createTable("users", {
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

        await queryInterface.dropTable("users")
    }
}
