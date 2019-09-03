const express = require("express");
const db = require("./data/db.js");
const server = express();
server.use(express.json());

// sanity check
server.get(`/`, (req, res) => {
  res.status(200).json({ api: "I'm up..." });
});

// POST request to /api/posts
server.post(`/api/posts`, (req, res) => {
  //   const postInfo = req.body;
  //   //   console.log(postInfo);
  //   if (postInfo.title && postInfo.contents) {
  //     db.insert(postInfo).then(ids => ({ id: ids[0] }));
  //     res.status(201).json(postInfo); // return HTTP status code 201 & newly created post
  //   } else {
  //     res.status(400).json({ error: "Requires title and contents" });
  //   }

  // destructuring
  const { title, contents } = req.body;

  if (title && contents) {
    // db.insert({ title, contents }).then(ids => ({ id: ids[0] }));
    db.insert({ title, contents })
      .then(({ id }) => {
        db.findById(id)
          .then(user => {
            res.status(201).json(user); // return HTTP status code 201 & newly created post
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: "server error retrieving post" });
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "server error inserting post" });
      });
  } else {
    res.status(400).json({ error: "Requires title and contents of post" });
  }
});

module.exports = server;
