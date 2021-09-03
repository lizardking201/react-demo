/* eslint-disable */
const comment = require("../../controllers/comment.js")

module.exports = async (req, res) => {
    comment.update(req, res)
}
