/* eslint-disable */
const post = require("../../controllers/post.js")

module.exports = async (req, res) => {
    post.updateViews(req, res)
}
