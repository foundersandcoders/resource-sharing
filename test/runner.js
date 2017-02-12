// Comment out tests to selectively run certain files only
// Each test suite should be self-contained and should clear db after running

const _ = require('./helpers.js');

_.clearTables()
.then(() => {
  require('./routes/register.js');
  require('./routes/login.js');
  require('./teardown.js');
})
.catch(console.error);
