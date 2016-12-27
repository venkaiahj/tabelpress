const {isString} = require('lodash');

function run(name) {
  console.log(isString(name) ? `hello ${name}` : 'hello');
  return Promise.resolve();
}

module.exports = run;
