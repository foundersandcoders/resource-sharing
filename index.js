const server = require('./src/server');
const buildDatabase = require('./db_build.js');

const startServer = (err, result) => {
  if (err) console.log('unable to build database:', err);
  else {
    server.start( (err) => {
      if (err) throw err;
      console.log(`Server is running on port: ${server.info.uri}`);
    });
  }
};

buildDatabase(startServer);
