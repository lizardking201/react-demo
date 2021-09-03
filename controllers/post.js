/* eslint-disable */
const Auth = require("../utils/authFunctions.js")
const db = require("../models/index.js")
/* eslint-enable */
const Comment = db.comment
const CommentResponse = db.comment_response
const Post = db.post
const User = db.user
const Op = db.Sequelize.Op

exports.create = async (req, res) => {}

exports.delete = async (req, res) => {
    const { id } = req.params
    const { isReply } = req.body
    const { authenticated, user } = Auth.parseAuthentication(req)

    if (!authenticated) {
        return res.status(422).send({ error: true, msg: "You must be logged in" })
    }

    if (isReply === 1) {
        const count = await CommentResponse.count({
            col: "comment.id",
            distinct: true,
            where: {
                id,
                userId: user.data.id
            }
        }).then((count) => count)

        if (count === 0) {
            return res.status(500).send({
                error: true,
                msg: "That comment doesn't exist"
            })
        }

        CommentResponse.destroy({
            where: {
                id
            }
        })
            .then(() => {
                return res.status(200).send({
                    error: false,
                    msg: "Comment successfully deleted"
                })
            })
            .catch((err) => {
                return res.status(500).send({
                    error: true,
                    msg: err.message || "An error occurred"
                })
            })
    }

    const count = await Comment.count({
        col: "comment.id",
        distinct: true,
        where: {
            id,
            userId: user.data.id
        }
    }).then((count) => count)

    if (count === 0) {
        return res.status(500).send({
            error: true,
            msg: "That comment doesn't exist"
        })
    }

    Comment.destroy({
        where: {
            id
        }
    })
        .then(() => {
            return res.status(200).send({
                error: false,
                msg: "Comment successfully deleted"
            })
        })
        .catch((err) => {
            return res.status(500).send({
                error: true,
                msg: err.message || "An error occurred"
            })
        })
}

exports.findAll = (req, res) => {
    const { commentCount, page, q, sort, dir } = req.query

    let limit = 20
    let order = [
        [db.Sequelize.col("commentCount"), "DESC"],
        [db.Sequelize.col("title"), "ASC"]
    ]
    let where = {
        [Op.or]: [
            {
                description: {
                    [Op.like]: `%${q}%`
                }
            },
            {
                title: {
                    [Op.like]: `%${q}%`
                }
            }
        ]
    }

    if (typeof q === "undefined" || q === "") {
        where = {}
    }

    if (typeof commentCount !== "undefined" && commentCount > 0) {
        where.commentCount = {
            [Op.gt]: commentCount
        }
    }

    let attributes = [
        [db.Sequelize.col("post.id"), "postId"],
        [db.Sequelize.col("post.title"), "postTitle"],
        [db.Sequelize.col("post.description"), "postDescription"],
        [db.Sequelize.col("post.createdAt"), "createdAt"],

        [db.Sequelize.col("user.name"), "userName"],
        [db.Sequelize.col("user.id"), "userId"],
        [db.Sequelize.col("user.username"), "userUsername"],

        [
            db.Sequelize.fn("COUNT", db.Sequelize.fn("DISTINCT", db.Sequelize.col("comments.id"))),
            "commentCount"
        ]
    ]
    let include = [
        {
            attributes: [],
            model: Comment,
            required: false
        },
        {
            attributes: [],
            model: User,
            required: true
        }
    ]
    const offset = isNaN(page) ? 0 : page * limit

    Post.findAll({
        attributes,
        group: ["post.id"],
        include,
        limit,
        offset,
        order,
        raw: true,
        subQuery: false,
        where
    })
        .then((posts) => {
            const hasMore = posts.length === limit
            return res.status(200).send({
                error: false,
                hasMore,
                msg: "Success",
                page: parseInt(page) + 1,
                results: posts
            })
        })
        .catch((err) => {
            const msg = err.message || "Some error occurred"
            console.error("error msg", msg)
            return res.status(200).send({
                error: true,
                msg
            })
        })
}

exports.findOne = (req, res) => {}

exports.like = async (req, res) => {}

exports.update = async (req, res) => {}

exports.unlike = async (req, res) => {}
