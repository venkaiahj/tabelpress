const app = module.exports = require('express')();

const {loggedIn} = require('app/filters').auth;

const {getPosts, createPostForUser} = require('app/actions').posts;

app.get('/list', (req, res) => {
  getPosts(req.query)
    .then((posts) => res.send({posts}))
    .catch((err) => {
      console.log(err);
      res.status(400).send({msg: 'failed'});
    })
  ;
});

app.post('/create', loggedIn, (req, res) => {
  createPostForUser(req.user, req.body)
    .then((post) => res.send({post}))
    .catch((err) => {
      console.log(err);
      res.status(400).send({msg: 'failed'});
    })
  ;
});
