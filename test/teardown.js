const test = require('tape');
const _ = require('./helpers.js');

// teardown has its own test so that it runs sequentially after
// other tests. It clears the db and closes the pg connection.
test('Teardown...', (t) => {
  _.teardown();
  t.end();
});
