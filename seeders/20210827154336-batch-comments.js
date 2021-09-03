"use strict"
const faker = require("faker")
const db = require("../models/index.js")
const Post = db.post
const User = db.user

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         */
        const allUsers = await User.findAll()
        const allUserIds = allUsers.map((x) => x.id)

        const allPosts = await Post.findAll()
        const allPostIds = allPosts.map((x) => x.id)

        const commentCount = 1500
        const newData = []
        for (let i = 0; i < commentCount; i++) {
            const userId = allUserIds[Math.floor(Math.random() * allUserIds.length)]
            const postId = allPostIds[Math.floor(Math.random() * allPostIds.length)]

            newData.push({
                message: faker.lorem.sentences(),
                postId,
                userId,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        }

        return queryInterface.bulkInsert("comments", newData)
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("comments", null, {})
    }
}
