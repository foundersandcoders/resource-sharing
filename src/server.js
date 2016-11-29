const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');
const Handlebars = require('handlebars');

const server = new Hapi.Server();

server.connection({
  port: process.env.PORT || 4000
});

server.register([Vision, Inert], (err) => {
  if (err) throw err;

  server.views({
    engines: { hbs: Handlebars },
    path: './views',
    layoutPath: 'views/layout',
    layout: 'default'
    //partialsPath: 'views/partials'
  });

  server.route({
    path: '/',
    method: 'GET',
    handler: (req, reply) => {
      var sql = 'SELECT * FROM topics';
    //  connection.query(sql, (err, result) => {
        reply.view('topics', {});
    //  })
    }
  });

  server.route({
    method: 'GET',
    path: '/static/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  });

})

module.exports = server;
