const test = require('tape');
const server = require('../../src/server.js');
const _ = require('../helpers.js');

const userObj = {
  firstname: 'Sherlock',
  lastname: 'Holmes',
  github: 'shcodes_24',
  email: 'sh_24@gmail.com',
  username: 'shcodes_24',
  password1: 'ilikeowls',
  password2: 'ilikeowls'
};

test('POST to /login with correct details logs existing user in, redirects to home', (t) => {
  server.inject({
    method: 'POST',
    url: '/register',
    payload: userObj
  })
  .then((res) => {
    return server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: userObj.username,
        password: userObj.password1
      }
    });
  })
  .then((res) => {
    const expectedCode = 302;
    const actualCode = res.statusCode;
    t.equal(actualCode, expectedCode);

    const actualLocation = res.headers.location;
    const expectedLocation = '/';
    t.equal(actualLocation, expectedLocation);

    t.ok(res.headers['set-cookie'].length > 0);
    // not sure if this is a good way to test cookies present
    t.end();
  })
  .catch(console.error);
});

test('POST to /login with incorrect password gives error message', (t) => {
  server.inject({
    method: 'POST',
    url: '/login',
    payload: {
      username: userObj.username,
      password: 'ilikeoowls'
    }
  })
  .then((res) => {
    t.ok(res.payload.includes('Login failed. Please check your username and password and try again.'));
    t.end();
  })
  .catch(console.error);
});

test('POST to /login with non-existent user gives error message', (t) => {
  server.inject({
    method: 'POST',
    url: '/login',
    payload: {
      username: 'moriarty',
      password: 'whatever'
    }
  })
  .then((res) => {
    t.ok(res.payload.includes('Login failed. Please check your username and password and try again.'));
    t.end();
  })
  .catch(console.error);
});

test('Clearing DB...', (t) => {
  _.clearTables()
  .then(() => t.end());
});
