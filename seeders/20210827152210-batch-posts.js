"use strict"
const faker = require("faker")
const db = require("../models/index.js")
const User = db.user

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         */
        const allUsers = await User.findAll()
        const allIds = allUsers.map((x) => x.id)

        const postCount = 250
        const newData = []
        for (let i = 0; i < postCount; i++) {
            const rand = allIds[Math.floor(Math.random() * allIds.length)]

            newData.push({
                description: faker.lorem.paragraphs(),
                title: faker.lorem.sentence(),
                userId: rand,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        }

        return queryInterface.bulkInsert("posts", newData)
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("posts", null, {})
    }
}
