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
  path: '/create-resource',
  handler (req, reply) {
    reply.view('new_resource_form');
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
    queries.checkLogin(req.payload, (err, userInfo) => {
      if (err) {
        console.log('Unable to login');
        reply.view('login', { loginFailed: true });
      } else {
        req.cookieAuth.set({ username: userInfo.username, userid: userInfo.id });
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

const newReviewForm = {
  method: 'GET',
  path: '/create-review/{endpoint}',
  handler (req, reply) {
    reply.view('new_review_form', { endpoint: req.params.endpoint });
  }
};

const createReview = {
  method: 'POST',
  path: '/create-review',
  handler (req, reply) {
    queries.createReview(req.payload, (err, redirect) => {
      if (err) console.log('Unable to create review', err);
      reply.redirect(redirect);
    });
  }
};

module.exports = [
  home,
  fileServer,
  newResourceForm,
  createResource,
  topicsEndpoint,
  login,
  loginSubmit,
  logout,
  newReviewForm,
  createReview
];
