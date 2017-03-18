const randToken = require('rand-token');
const shape = require('shape-errors');
const bcrypt = require('bcryptjs');
const {isString} = require('lodash');

const authConfig = require('config').auth;

const {cache} = require('app/orm');
const authHash = cache.hash('auth');

const {
  findUserByUsername,
  createUser,
  findUserById
} = require('./users');

function register(data={}) {
  return shape({
    username: (username) => (
      isString(username) && username.length > 0 ?
        findUserByUsername(username).then((user) => user ? 'not-unique' : null) :
        'invalid'
    ),
    password: (password) => isString(password) && password.length > 6 ? null : 'invalid',
    password_confirmation: (password_confirmation, {password}) => password === password_confirmation ? null : 'invalid'
  }).errors(data).then((err) => err ? (
    Promise.reject(err)
  ) : (
    createUser(data)
  ));
}

function login({username, password}) {
  return findUserByUsername(username).then((user) => user ? (
    bcrypt.compare(password, user.hashed_password).then((res) => res ? (
      generateUniqueAuthToken(user).then((token) => ({token, user}))
    ) : (
      Promise.reject(new Error('invalid password'))
    ))
  ) : (
    Promise.reject(new Error('invalid token'))
  )).then(({token, user}) => authHash.set(token, user.id, authConfig.tokenLifetime).then(() => ({token, user})));
}

function check(authKey) {
  return authHash.get(authKey).then((userId) => {
    if (userId === null) {
      return null;
    } else {
      return findUserById(userId);
    }
  });
}

function refresh(authKey) {
  return check(authKey).then((user) => {
    if (user === null) {
      return null;
    } else {
      return authHash.del(authKey)
        .then(() => generateUniqueAuthToken(user))
        .then((newToken) => (
          authHash.set(newToken, user.id, authConfig.tokenLifetime)
            .then(() => newToken)
        ))
      ;
    }
  });
}

function logout(authKey) {
  return check(authKey).then((user) => {
    if (user === null) {
      return true;
    } else {
      return authHash.del(authKey).then(() => true);
    }
  });
}

function generateUniqueAuthToken(user) {
  const key = randToken.generate(72);

  return authHash.get(key).then((existing) => {
    if (existing === null) {
      return key;
    } else {
      return generateUniqueAuthToken(user);
    }
  });
}

module.exports = {
  register,
  login,
  check,
  refresh,
  logout
};
