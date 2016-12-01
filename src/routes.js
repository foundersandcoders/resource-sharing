const queries = require('./queries.js');

const home = {
  method: 'GET',
  path: '/',
  handler (req, reply) {
    queries.getTopics((err, topics) => {
      console.log(req.auth.credentials);
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

const newResourceForm = {
  method: 'GET',
  path: '/create-resource/{topic}',  // this request is fired from the list of resources page...
  handler (req, reply) {
    var topic = encodeURIComponent(req.params.topic);
    reply.view('new_resource_form', {topic});
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

const login = {
  method: 'GET',
  path: '/login',
  handler (req, reply) {
    reply.view('login');
  }
};

const loginSubmit = {
  method: 'POST',
  path: '/login',
  handler (req, reply) {
    queries.checkLogin(req.payload, (err, isMatch) => {
      if (!isMatch || err) {
        console.log('Unable to login');
        reply.view('login', { loginFailed: true });
      } else {
        req.cookieAuth.set({ username: req.payload.username });
        reply.redirect('/');
      }
    });
  }
};

const logout = {
  method: 'GET',
  path: '/logout',
  handler (req, reply) {
    req.cookieAuth.clear();
    reply.redirect('/');
  }
};

module.exports = [home, fileServer, newResourceForm, createResource, topicsEndpoint, login, loginSubmit, logout];
