const queries = require('./queries.js');

const home = {
  method: 'GET',
  path: '/',
  handler (req, reply) {
    queries.getTopics((err, topics) => {
      if (err) console.log('No topics were loaded!', err);
      console.log(topics);
      reply.view('topics', { topics });
    });
  }
};

const fileServer = {
  method: 'GET',
  path: '/static/{param*}',
  handler: {
    directory: {
      path: 'public'
    }
  }
};

module.exports = [home, fileServer];
