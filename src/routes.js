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

const fileServer = {
  method: 'GET',
  path: '/static/{param*}',
  handler: {
    directory: {
      path: 'public'
    }
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
        return reply(error).statusCode(400);
      } else if (!userInfo || userInfo == false) {
        reply.view('login', { loginFailed: true });
      } else {
        req.cookieAuth.set({ username: userInfo.username, userid: userInfo.id });
        reply.redirect('/');
      }
    });
  }
};

const register = {
  method: 'GET',
  path: '/register',
  handler (req, reply) {
    reply.view('register');
  }
};

const registerSubmit = {
  method: 'POST',
  path: '/register',
  handler (req, reply) {
    if (req.payload.password1 !== req.payload.password2) {
      reply.view('register', { password: true });
    } else {
      queries.registerUser(req.payload, (err, userinfo) => {
        if (err) console.log(err);
        req.cookieAuth.set({username: userinfo.username, userid: userinfo.id});
        reply.redirect('/');
      });
    }
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

const resourcesEndpoint = {
  method: 'GET',
  path: '/{topicsEndpoint}/{resourcesEndpoint}',
  handler (req, reply) {
    queries.getReviews(req.params.resourcesEndpoint, (err, reviews, title) => {
      if (err) console.log('No reviews were loaded!', err);
      reply.view('reviews', { reviews, title});
    });
  }
};

const createResource = {
  method: 'GET',
  path: '/create-resource',
  config: {
    auth: {
      mode: 'required',
      strategy: 'session'
    },
    handler (req, reply) {
      reply.view('new_resource_form');
    }
  }
};

const submitResource = {
  method: 'POST',
  path: '/create-resource/submit',
  handler (req, reply) {
    queries.createResource(req.payload, (err, redirect) => {
      if (err) console.log('Unable to create resource', err);
      reply.redirect(redirect);
    });
  }
};

const editNoResource = {
  method: 'GET',
  path: '/edit-resource',
  handler (req, reply) {
    reply.redirect('/');
  }
};

const editResource = {
  method: 'GET',
  path: '/edit-resource/{resourcesEndpoint}',
  handler (req, reply) {
    queries.getMyResource(req.params.resourcesEndpoint, (err, data) => {
      if (err) console.log('Unable to retrieve resource', err);
      reply.view('edit_resource', { data });
    });
  }
};

const updateResource = {
  method: 'POST',
  path: '/edit-resource/submit',
  handler (req, reply) {
    queries.updateMyResource(req.payload, (err, redirect) => {
      if (err) console.log('Unable to update resource', err);
      reply.redirect(redirect);
    });
  }
};

const createReview = {
  method: 'GET',
  path: '/create-review/{endpoint}',
  config: {
    auth: {
      mode: 'required',
      strategy: 'session'
    },
    handler (req, reply) {
      reply.view('new_review_form', { endpoint: req.params.endpoint });
    }
  }
};

const submitReview = {
  method: 'POST',
  path: '/create-review/submit',
  handler (req, reply) {
    queries.createReview(req.payload, (err, redirect) => {
      if (err) console.log('Unable to create review', err);
      reply.redirect(redirect);
    });
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

module.exports = [
  home,
  fileServer,
  updateResource,
  login,
  loginSubmit,
  register,
  registerSubmit,
  logout,
  topicsEndpoint,
  resourcesEndpoint,
  createResource,
  submitResource,
  editResource,
  editNoResource,
  createReview,
  submitReview,
  reviewsByUser
];
