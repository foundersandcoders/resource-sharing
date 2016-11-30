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

const fileServer = {
  method: 'GET',
  path: '/static/{param*}',
  handler: {
    directory: {
      path: 'public'
    }
  }
};

const newResourceForm = {
  method: 'GET',
  path: '/create-resource/{topic}',  // this request is fired from the list of resources page...
  handler (req, reply) {
    var topic = encodeURIComponent(req.params.topic);
    reply.view('new_resource_form', {topic});
  }
};

const reviewsByUser = {
  method: 'GET',
  path: '/users/{username}',
  handler (req, reply) {
    var username = encodeURIComponent(req.params.username);
    queries.getReviewsByUser(username, (err, reviews) => {
      if (err) console.log(err);
      reply.view('reviews_by_user', { username, reviews });
    });
  }
};

const createResource = {
  method: 'POST',
  path: '/create-resource/submit',
  handler (req, reply) {
    queries.createResource(req.payload, (err, redirect) => {
      if (err) console.log('Unable to create resource', err);
      reply.redirect(redirect);
    });
  }
};

module.exports = [home, fileServer, newResourceForm, createResource, reviewsByUser];
