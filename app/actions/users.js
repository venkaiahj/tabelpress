const bcrypt = require('bcryptjs');

const {table} = require('app/orm');

function findUserByUsername(username) {
  return table('users').find('username', username);
}

function findUserById(id) {
  return table('users').find(id);
}

function createUser({username, password}) {
  return bcrypt.hash(password, 10)
    .then((hashed_password) => table('users').insert({username, hashed_password}))
  ;
}

module.exports = {
  findUserByUsername,
  findUserById,
  createUser
};
