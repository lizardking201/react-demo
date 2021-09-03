"use strict"
const faker = require("faker")
const randomstring = require("randomstring")
const sha1 = require("sha1")

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         */

        const userCount = 50
        const newData = []
        for (let i = 0; i < userCount; i++) {
            newData.push({
                email: faker.internet.email(),
                emailVerified: false,
                name: faker.name.findName(),
                password: sha1(randomstring.generate(7)),
                username: faker.internet.userName(),
                createdAt: new Date(),
                updatedAt: new Date()
            })
        }

        return queryInterface.bulkInsert("users", newData)
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("users", null, {})
    }
}
