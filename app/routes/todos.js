const app = module.exports = require('express')();

const {loggedIn} = require('app/filters').auth;

const {getTodos, createTodoForUser, updateTodoForUser, deleteTodo} = require('app/actions').todos;

app.get('/list', (req, res) => {
  getTodos(req.query)
    .then((todos) => res.send({todos}))
    .catch((err) => {
      console.log(err);
      res.status(400).send({msg: 'failed'});
    })
  ;
});

app.post('/create', loggedIn, (req, res) => {
  createTodoForUser(req.user, req.body)
    .then((todo) => res.send({todo}))
    .catch((err) => {
      console.log(err);
      res.status(400).send({msg: 'failed'});
    })
  ;
});

app.post('/update', loggedIn, (req, res) => {
  var updatedTodo =  req.body.updateTo;
  var todoId = req.body.todoId;
  console.log(req.body);
  updateTodoForUser(req.user, req.body, updatedTodo, todoId)
    .then((todo) => res.send({todo}))
    .catch((err) => {
      console.log(err);
      res.status(400).send({msg: 'failed'});
    })
  ;
});

app.get('/delete', loggedIn, (req, res) => {
  var todoId = req.query.todoId;
  console.log(req.query, todoId);
  deleteTodo(todoId)
    .then((todo) => res.send({todo}))
    .catch((err) => {
      console.log(err);
      res.status(400).send({msg: 'failed'});
    })
  ;
});