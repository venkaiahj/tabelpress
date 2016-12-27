const shape = require('shape-errors');
const isuuid = require('is-uuid');
const {isString} = require('lodash');

const {table, scoper} = require('app/orm');

function getPosts(params={}) {
  const t = table('posts').eagerLoad('user');

  return scoper({
    user_id: (t, user_id) => isuuid(user_id) ? t.where('user_id', user_id) : t,
    title: (t, title) => isString(title) ? t.whereRaw('lower(title) like ?', [`${title}%`]) : t
  }).apply(t, params).all();
}

function createPostForUser(user, data={}) {
  return shape({
    title: (title) => isString(title) && title.length > 0 ? (
      findPostByTitle(title).then((post) => post ? 'not unique' : null)
    ) : (
      'invalid'
    ),
    body: (body) => isString(body) && body.length > 0
  }).errors(data).then((err) => err ? (
    Promise.reject(err)
  ) : (
    table('posts').insert({
      ...data,
      user_id: user.id
    })
  ));
}

function findPostByTitle(title) {
  return table('posts').find('title', title);
}

module.exports = {
  getPosts,
  createPostForUser
};
