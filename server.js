/* eslint-disable */
const express = require("express")
const next = require("next")
const bodyParser = require("body-parser")
const db = require("./models/index.js")
const comments = require("./controllers/comment.js")
const post = require("./controllers/post.js")
const users = require("./controllers/user.js")
/* eslint-enable */

const port = 3000
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev: true })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()
    server.use(bodyParser.json({ limit: "250mb" }))
    server.use(bodyParser.urlencoded({ extended: true, limit: "250mb" }))
    db.sequelize.sync()

    // Comments
    server.post("/api/comment/create", comments.create)
    server.post("/api/comment/like", comments.like)
    server.get("/api/comment/search", comments.findAll)
    server.post("/api/comment/unlike", comments.unlike)
    server.post("/api/comment/update", comments.update)
    server.post("/api/comment/:id/delete", comments.delete)

    // Posts
    server.post("/api/post/create", post.create)
    server.post("/api/post/like", post.like)
    server.get("/api/post/search", post.findAll)
    server.post("/api/post/unlike", post.unlike)
    server.post("/api/post/update", post.update)
    server.post("/api/post/:id/delete", post.delete)

    // Users
    server.get("/api/user/count", users.count)
    server.post("/api/user/create", users.create)
    server.post("/api/user/login", users.login)
    server.get("/api/user/search", users.findAll)
    server.post("/api/user/update", users.update)
    server.post("/api/user/verify", users.verify)
    server.get("/api/user/:username", users.findOne)
    server.get("/api/user/:id/comments", users.getUserComments)

    server.all("*", (req, res) => {
        return handle(req, res)
    })

    server.listen(port, (err) => {
        if (err) {
            throw err
        }
        console.log(`> Ready on http://localhost:${port}`)
    })
})
