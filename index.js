const server = require('./src/server');

server.start( (err) => {
  if (err) throw err;
  console.log(`Server is running on port: ${server.info.uri}`);
});
