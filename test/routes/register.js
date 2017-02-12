const test = require('tape');
const server = require('../../src/server.js');
const _ = require('../helpers.js');

test('POST to /register 1) redirects to home, 2) creates new user in database', (t) => {
  const userObj = {
    firstname: 'Sherlock',
    lastname: 'Holmes',
    github: 'shcodes_24',
    email: 'sh_24@gmail.com',
    username: 'shcodes_24',
    password1: 'ilikeowls',
    password2: 'ilikeowls'
  };
  server.inject({
    method: 'POST',
    url: '/register',
    payload: userObj
  })
  .then((res) => {
    const actual = res.headers.location;
    const expected = '/';
    t.equal(actual, expected);
    return _.get('users');
  })
  .then((res) => {
    const expected = userObj.firstname;
    const actual = res[0].firstname;
    t.equal(actual, expected);
    t.end();
  })
  .catch(console.error);
});

test('POST to /register with non-matching passwords 1) returns register page with error message, 2) does not store user', (t) => {
  const userObj = {
    firstname: 'Mycroft',
    lastname: 'Holmes',
    github: 'mhcodes_21',
    email: 'mh_21@gmail.com',
    username: 'mhcodes_21',
    password1: 'ilikeowls',
    password2: 'ilikesherlock'
  };
  server.inject({
    method: 'POST',
    url: '/register',
    payload: userObj
  })
  .then((res) => {
    t.ok(res.payload.includes('Passwords do not match'));
    return _.getWhere('users', 'firstname', userObj.firstname);
  })
  .then((res) => {
    const expected = 0;
    const actual = res.length;
    t.equal(actual, expected);
    t.end();
  })
  .catch(console.error);
});

test('Clear DB', (t) => {
  _.clearTables()
  .then(() => t.end());
});
