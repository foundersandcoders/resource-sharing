const queries = require('./queries.js');

const home = {
  method: 'GET',
  path: '/',
  handler (req, reply) {
    queries.getTopics((err, topics) => {
      if (err) console.log('No topics were loaded!', err);
      reply.view('topics', { topics });
    });
  }
};

const topicsEndpoint = {
  method: 'GET',
  path: '/{topicsEndpoint}',
  handler (req, reply) {
    queries.getResources(req.params.topicsEndpoint, (err, resources) => {
      if (err) console.log('No resources were loaded!', err);
      reply.view('resources', { resources });
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

module.exports = [home, topicsEndpoint, fileServer];
