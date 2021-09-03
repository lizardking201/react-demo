/* eslint-disable */
const comment = require("../../controllers/comment.js")

module.exports = async (req, res) => {
    comment.findAll(req, res)
}
