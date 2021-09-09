/* eslint-disable */
const db = require("../models/index.js")
const { QueryTypes } = require("sequelize")
/* eslint-enable */
const Comment = db.comment
const CommentLike = db.comment_like
const CommentResponse = db.comment_response
const Post = db.post
const User = db.user
const Op = db.Sequelize.Op

exports.create = async (req, res) => {}

exports.delete = async (req, res) => {}

exports.findAll = async (req, res) => {
    const { likeCount, page, q, sort, dir } = req.query

    let limit = 20
    let order = [
        [db.Sequelize.col("likeCount"), "DESC"],
        [db.Sequelize.col("message"), "ASC"]
    ]
    let where = {
        message: {
            [Op.like]: `%${q}%`
        }
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
        [db.Sequelize.col("comment.id"), "id"],
        [db.Sequelize.col("comment.message"), "message"],

        [db.Sequelize.col("user.id"), "userId"],
        [db.Sequelize.col("user.username"), "userUsername"],
        [db.Sequelize.col("user.name"), "userName"],

        [db.Sequelize.col("post.id"), "postId"],
        [db.Sequelize.col("post.title"), "postTitle"],
        [db.Sequelize.col("post.description"), "postDescription"],

        [
            db.Sequelize.fn(
                "COUNT",
                db.Sequelize.fn("DISTINCT", db.Sequelize.col("comment_likes.id"))
            ),
            "likeCount"
        ]
    ]
    let include = [
        {
            attributes: [],
            model: Post,
            required: true
        },
        {
            attributes: [],
            model: User,
            required: true
        },
        {
            attributes: [],
            model: CommentLike,
            required: false
        }
    ]
    const offset = isNaN(page) ? 0 : page * limit

    Comment.findAll({
        attributes,
        group: ["comment.id"],
        include,
        limit,
        offset,
        order,
        raw: true,
        subQuery: false,
        where
    })
        .then((comments) => {
            const hasMore = comments.length === limit
            return res.status(200).send({
                error: false,
                hasMore,
                msg: "Success",
                page: parseInt(page) + 1,
                results: comments
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

exports.like = async (req, res) => {
    const { commentId, responseId } = req.body
    const { authenticated, user } = Auth.parseAuthentication(req)

    if (!authenticated) {
        return res.status(422).send({ error: true, msg: "You must be logged in" })
    }

    let where = {
        userId: user.data.id
    }

    let likeData = {
        commentId,
        userId: user.data.id
    }

    if (typeof commentId !== "undefined" && commentId !== "") {
        where.commentId = commentId
    }

    if (typeof responseId !== "undefined" && responseId !== "") {
        where = {
            responseId,
            userId: user.data.id
        }

        likeData = {
            responseId,
            userId: user.data.id
        }
    }

    if (typeof where.commentId === "undefined" && typeof where.responseId === "undefined") {
        return res.status(500).send({
            error: true,
            msg: "You must include a comment"
        })
    }

    const count = await CommentLike.count({
        col: "commentLike.id",
        distinct: true,
        where
    }).then((count) => count)

    if (count === 1) {
        return res.status(500).send({
            error: true,
            msg: "You already liked this comment"
        })
    }

    CommentLike.create(likeData)
        .then(() => {
            return res.status(200).send({
                error: false,
                msg: "Liked!"
            })
        })
        .catch((err) => {
            return res.status(500).send({
                error: true,
                msg: err.message || "An error occurred"
            })
        })
}

exports.unlike = async (req, res) => {
    const { commentId, responseId } = req.body
    const { authenticated, user } = Auth.parseAuthentication(req)

    if (!authenticated) {
        return res.status(422).send({ error: true, msg: "You must be logged in" })
    }

    let where = {
        userId: user.data.id
    }

    if (typeof commentId !== "undefined" && commentId !== "") {
        where.commentId = commentId
    }

    if (typeof responseId !== "undefined" && responseId !== "") {
        where = {
            responseId,
            userId: user.data.id
        }
    }

    const count = await CommentLike.count({
        col: "commentLike.id",
        distinct: true,
        where
    }).then((count) => count)

    if (count === 0) {
        return res.status(500).send({
            error: true,
            msg: "You haven't liked this comment"
        })
    }

    CommentLike.destroy({ where })
        .then(() => {
            return res.status(200).send({
                error: false,
                msg: "Unliked"
            })
        })
        .catch((err) => {
            return res.status(500).send({
                error: true,
                msg: err.message || "An error occurred"
            })
        })
}

exports.update = async (req, res) => {}
