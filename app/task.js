const {orm} = require('app/orm');
const {handleAsyncExceptions} = require('app/util');

const tasks = require('app/tasks');

function run(taskName, ...args) {
  const taskNames = Object.keys(tasks);

  if (taskNames.indexOf(taskName) === -1) {
    console.log(`Available tasks: ${taskNames}`);
    return Promise.resolve(null);
  } else {
    return tasks[taskName](...args);
  }
}

module.exports = run;

if (require.main === module) {
  handleAsyncExceptions();

  const [taskName, ...args] = process.argv.slice(2);

  run(taskName, ...args)
    .then(() => setTimeout(() => orm.close(), 1000))
  ;
}
