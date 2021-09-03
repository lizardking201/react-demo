"use strict"
const faker = require("faker")
const db = require("../models/index.js")
const Comment = db.comment
const User = db.user

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         */

        const allUsers = await User.findAll()
        const allUserIds = allUsers.map((x) => x.id)

        const allComments = await Comment.findAll()
        const allCommentIds = allComments.map((x) => x.id)

        const responseCount = 1500
        const newData = []
        for (let i = 0; i < responseCount; i++) {
            const userId = allUserIds[Math.floor(Math.random() * allUserIds.length)]
            const commentId = allCommentIds[Math.floor(Math.random() * allCommentIds.length)]

            newData.push({
                message: faker.lorem.sentence(),
                responseTo: commentId,
                userId,
                createdAt: new Date()
            })
        }

        return queryInterface.bulkInsert("comment_responses", newData)
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("comment_responses", null, {})
    }
}
