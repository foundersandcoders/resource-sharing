const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');
const Handlebars = require('handlebars');
const CookieAuth = require('hapi-auth-cookie');
const routes = require('./routes.js');

const server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 4000
});

server.register([Vision, Inert, CookieAuth], (err) => {
  if (err) throw err;

  server.auth.strategy('session', 'cookie', {
    password: 'datagangrulesokdatagangrulesokdatagangrulesok',
    cookie: 'datagang-cookie',
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000
  });

  server.views({
    engines: { hbs: Handlebars },
    path: './views',
    layoutPath: 'views/layout',
    layout: 'default'
    // partialsPath: 'views/partials'
  });

  server.route(routes);
});

module.exports = server;
