/* eslint-disable */
const Auth = require("../utils/authFunctions.js")
const db = require("../models/index.js")
const parseJson = require("parse-json")
const randomize = require("randomatic")
const sha1 = require("sha1")
const validator = require("validator")
const { QueryTypes } = require("sequelize")
/* eslint-enable */
const Comment = db.comment
const CommentResponse = db.comment_response
const Post = db.post
const User = db.user
const Op = db.Sequelize.Op

exports.count = async (req, res) => {}

exports.create = async (req, res) => {}

exports.findAll = async (req, res) => {
    const { commentCount, page, q, sort, dir } = req.query

    let limit = 20
    let order = [
        [db.Sequelize.col("commentCount"), "DESC"],
        [db.Sequelize.col("name"), "ASC"]
    ]
    let where = {
        // [Op.or]: [
        name: {
            [Op.like]: `%${q}%`
        }
        // [Op.or]: [
        //    {
        //        username: {
        //            [Op.like]: `%${q}%`
        //        }
        //    }
        // ]
        // ]
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
        [db.Sequelize.col("user.name"), "name"],
        [db.Sequelize.col("user.id"), "id"],
        [db.Sequelize.col("user.username"), "username"],
        [
            db.Sequelize.fn("COUNT", db.Sequelize.fn("DISTINCT", db.Sequelize.col("comments.id"))),
            "commentCount"
        ]
    ]
    let include = [
        {
            attributes: [],
            model: Post,
            required: false
        },
        {
            attributes: [],
            model: Comment,
            required: false
        }
    ]
    const offset = isNaN(page) ? 0 : page * limit

    User.findAll({
        attributes,
        group: ["user.id"],
        include,
        limit,
        offset,
        order,
        raw: true,
        subQuery: false,
        where
    })
        .then((users) => {
            const hasMore = users.length === limit
            return res.status(200).send({
                error: false,
                hasMore,
                msg: "Success",
                page: parseInt(page) + 1,
                results: users
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

exports.findOne = async (req, res) => {
    const { username } = req.params

    User.findOne({
        attributes: ["id", "email", "name", "username"],
        raw: true,
        where: {
            username
        }
    })
        .then(async (data) => {
            // The user with the given username does not exist
            if (data === null) {
                return res.status(404).send({
                    error: true,
                    msg: "This user does not exist"
                })
            }

            // Calculate comment counts
            const commentCount = await Comment.count({
                distinct: true,
                where: {
                    userId: data.id
                }
            }).then((count) => count)
            const responseCount = await CommentResponse.count({
                distinct: true,
                where: {
                    userId: data.id
                }
            }).then((count) => count)
            data.commentCount = commentCount + responseCount

            return res.status(200).send({
                error: false,
                msg: "success",
                user: data
            })
        })
        .catch((err) => {
            const msg = err.message || "Some error occurred"
            console.error("error msg", msg)
            res.status(500).send({
                error: true,
                msg
            })
        })
}

exports.getUserComments = async (req, res) => {}

exports.login = async (req, res) => {
    const { email, password } = req.body

    if (typeof email === "undefined" || email === "") {
        return res.status(401).send({ error: true, msg: "Email is empty" })
    }

    if (!validator.isEmail(email)) {
        return res.status(401).send({ error: true, msg: "Not a valid email" })
    }

    if (typeof password === "undefined" || password === "") {
        return res.status(401).send({ error: true, msg: "Password is empty" })
    }

    User.findAll({
        attributes: [
            "bio",
            "createdAt",
            "email",
            "emailVerified",
            "id",
            "img",
            "name",
            "race",
            "username",
            "verificationCode"
        ],
        limit: 1,
        raw: true,
        where: {
            email,
            password: sha1(password)
        }
    })
        .then((data) => {
            if (data.length === 1) {
                const userData = data[0]
                const token = Auth.signToken(userData)
                return res.status(200).send({
                    error: false,
                    msg: "Login successful",
                    token,
                    user: userData
                })
            }

            return res.status(401).send({
                error: true,
                msg: "Wrong password"
            })
        })
        .catch((err) => {
            return res.status(500).send({
                error: true,
                msg: err.message || "Some error occurred"
            })
        })
}

exports.update = async (req, res) => {}

exports.verify = async (req, res) => {}
