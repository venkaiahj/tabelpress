const app = module.exports = require('express')();

const {omit} = require('lodash');

const {loggedIn, loggedOut} = require('app/filters/auth');

const {register, login, logout, refresh} = require('app/actions').auth;

app.post('/register', loggedOut, (req, res) => {
  register(req.body)
    .then(() => res.send({msg: 'done'}))
    .catch((err) => {
      console.log(err);
      res.status(400).send({msg: 'failed'});
    })
  ;
});

app.post('/login', loggedOut, (req, res) => {
  login(req.body)
    .then(({token, user}) => res.send({
      token,
      user: omit(user, 'hashed_password')
    }))
    .catch((err) => {
      console.log(err);
      res.status(400).send({msg: 'failed'});
    })
  ;
});

app.post('/logout', loggedIn, (req, res) => {
  logout(req.authKey, req.body).then(() => res.send({msg: 'logged out'}));
});

app.post('/account', loggedIn, (req, res) => {
  res.send({user: omit(req.user, 'hashed_password')});
});

app.post('/refresh', loggedIn, (req, res) => {
  refresh(req.authKey).then((token) => res.send({token}));
});
