const express = require("express");
const router = express.Router();
// const router = require("express").Router();
const db = require("../data/db.js");

// router can have middleware that applies only to the router
router.use(express.json());

// When the client makes a GET request to /api/posts

router.get(`/`, (req, res) => {
  // res.send("is this working?");
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

// When the client makes a POST request to /api/posts:

router.post(`/`, (req, res) => {
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

// When the client makes a POST request to /api/posts/:id/comments

router.post(`/:id/comments`, (req, res) => {
  const addedComment = req.body;
  const postId = req.params.id;

  // If the request body is missing the text property:
  if (!addedComment.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    db.findById(postId).then(post => {
      // If the information about the comment is valid:
      if (post[0]) {
        db.insertComment({ ...addedComment, post_id: postId }) // comment requires post_id
          .then(comment =>
            db
              .findCommentById(comment.id)
              .then(commentInfo => {
                res.status(201).json(commentInfo);
              })
              .catch(err => console.log(err))
          )
          // If there's an error while saving the comment:
          .catch(err => {
            // console.log(err);
            res.status(500).json({
              error:
                "There was an error while saving the comment to the database"
            });
          });
      } else {
        // If the post with the specified id is not found:
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    });
  }
});

// When the client makes a GET request to /api/posts/:id:
// - If the _post_ with the specified `id` is not found:
//   - return HTTP status code `404` (Not Found).
//   - return the following JSON object: `{ message: "The post with the specified ID does not exist." }`.

router.get(`/:id`, (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(post => {
      if (post[0]) {
        // if there is a value in the array returned, return the post
        res.status(200).json(post[0]);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: "There was a router error retrieving the post." }); // when would this be triggered?
    });
});

// When the client makes a GET request to /api/posts/:id/comments
router.get(`/:id/comments`, (req, res) => {
  const postId = req.params.id;
  db.findPostComments(postId)
    .then(comments => {
      if (comments[0]) {
        res.status(200).json(comments);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

// When the client makes a DELETE request to /api/posts/:id
router.delete(`/:id`, (req, res) => {
  const id = req.params.id;
  db.remove(id) // returns number of records deleted
    .then(post => {
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

// When the client makes a PUT request to /api/posts/:id
router.put(`/:id`, (req, res) => {
  const id = req.params.id;
  const editedPost = req.body;

  if (editedPost.title && editedPost.contents) {
    // If the post is found and the new information is valid:
    db.update(id, editedPost).then(updatedPost => {
      // GET POST
      if (updatedPost) {
        db.findById(id)
          .then(post => {
            if (post[0]) {
              res.status(200).json(post[0]);
            } else {
              res.status(404).json({
                message: "The post with the specified ID does not exist."
              });
            }
          })
          .catch(err => {
            res.status(500).json({
              message: "There was a router error retrieving the post."
            });
          });
      } else {
        res
          .status(404)
          .json({ error: "The post with the specified ID does not exist." });
      }
    });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

module.exports = router;
