const shape = require('shape-errors');
const isuuid = require('is-uuid');
const {isString} = require('lodash');

const {table, scoper} = require('app/orm');

function getTodos(params={}) {
  const t = table('todos').eagerLoad('user');
  return scoper({
    user_id: (t, user_id) => isuuid.v1(user_id) ? t.where('user_id', user_id) : t,
    title: (t, title) => isString(title) ? t.whereRaw('lower(title) like ?', [`${title}%`]) : t
  }).apply(t, params).all();
}

function createTodoForUser(user, data={}) {
  return shape({
    title: (title) => isString(title) && title.length > 0 ? (
      findTodoByTitle(title).then((todo) => todo ? 'not unique' : null)
    ) : (
      'invalid'
    ),
    tag: (tag) => isString(tag) && tag.length > 0? null: 'not valid'
  }).errors(data).then((err) => err ? (
    Promise.reject(err)
  ) : (
    table('todos').insert({
      ...data,
      user_id: user.id
    })
  ));
}

function updateTodoForUser(user, data={}, updatedTodo, id) {
  var updatedTodoData  = Object.assign({}, data);
  updatedTodoData.title = updatedTodo;
  delete updatedTodoData.todoId;
  delete updatedTodoData.updateTo;
  console.log(id, isuuid.v4(id), data);
  return shape({
    todoId: (todoId) => todoId.length > 0 ? (
      findTodoById(todoId).then((todo) => todo ? null : 'not valid id')
    ) : (
      'invalid 1'
    )
  }).errors(data).then((err) => err ? (
    Promise.reject(err)
  ) : (
    table('todos').update({id,
      ...updatedTodoData,
      user_id: user.id
    })
  ));
}

function deleteTodo(todoId){
  var data = {'todoId': todoId};
  console.log(data);
  return shape({
    todoId: (todoId) => todoId.length > 0 ? (
      findTodoById(todoId).then((todo) => todo ? null : 'not valid id')
    ) : (
      'invalid'
    )
  }).errors(data).then((err) => err ? (
    Promise.reject(err)
  ) : (
    table('todos').delete({id: todoId})
  )); 
}


function findTodoById(id) {
  return table('todos').find('id', id);
}

function findTodoByTitle(title) {
  return table('todos').find('title', title);
}
module.exports = {
  getTodos,
  createTodoForUser,
  updateTodoForUser,
  deleteTodo
};
