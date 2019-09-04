const express = require("express");
const db = require("./data/db.js");
const server = express();
server.use(express.json());

// sanity check
server.get(`/`, (req, res) => {
  res.status(200).json({ api: "I'm up..." });
});

// 1. POST request to /api/posts
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
    db.insert({ title, contents })
      .then(({ id }) => {
        db.findById(id)
          .then(post => {
            res.status(201).json(post[0]); // return HTTP status code 201 & newly created post
          })
          .catch(err => {
            console.log(err);
            res
              .status(500)
              .json({ error: "There was a server error retrieving the post" });
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  } else {
    res
      .status(400)
      .json({ error: "Please provide title and contents for the post." });
  }
});

// // 2. POST request to /api/posts/:id/comments
// server.post(`/api/posts/:id/comments`, (req, res) => {
//   console.log(req.params.id);
//   res.end();
// });

// 3. When the client makes a GET request to /api/posts
server.get(`/api/posts`, (req, res) => {
  db.find()
    .then(posts => {
      console.log(posts);
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// 4. When the client makes a GET request to /api/posts/:id:
// - If the _post_ with the specified `id` is not found:
//   - return HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The post with the specified ID does not exist." }`.

// server.get(`/api/posts/:id`, (req, res) => {
//   const id = req.params.id;
//   console.log(id);
//   db.findById(id)
//     .then(id => {
//       console.log(id);
//       if (post[0]) {
//         // if there is a value in the array returned
//         res.status(200).json(post);
//       } else {
//         res
//           .status(404)
//           .json({ message: "The post with the specified ID does not exist." });
//       }
//     })
//     .catch(err => {
//       console.log(err);
//       res
//         .status(500)
//         .json({ message: "There was a server error retrieving the post." }); // when would this be triggered?
//     });
// });

// 5. When the client makes a GET request to /api/posts/:id/comments

// 6. When the client makes a DELETE request to /api/posts/:id
server.delete(`/api/posts/:id`, (req, res) => {
  const id = req.params.id;
  db.remove(id) // returns number of records deleted
    .then(post => {
      console.log("DELETE", typeof post);
      if (post === 1) {
        // better way to do this?
        res.status(200).json({ message: `Post id ${id} has been deleted` });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "The post could not be removed" });
    });
});

// 7. When the client makes a PUT request to /api/posts/:id

module.exports = server;
