const express = require("express");
// const db = require("./data/db.js");
const server = express();
const postsRouter = require(`./posts/postsRouter.js`);

// GLOBAL MIDDLEWARE
// ------------------------------------------------------------
// 1. see the request, stop the request and produce a response, or do nothing.
// 2. do the same with the response object.
// 3. can also modify the request or response object.
server.use(express.json()); // parses incoming requests as JSON. middleware used globally with server.use()

// route handlers
server.use(`/api/posts`, postsRouter);
// ------------------------------------------------------------

// Sanity check
server.get(`/`, (req, res) => {
  res.status(200).json({ api: "I'm up..." });
});

module.exports = server;
