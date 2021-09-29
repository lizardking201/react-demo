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
    return res.status(500).send({
        error: true,
        msg: "Some error occurred"
    })
}

exports.findOne = async (req, res) => {
    return res.status(500).send({
        error: true,
        msg: "Some error occurred"
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
