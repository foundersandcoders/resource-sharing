const Bcrypt = require('bcrypt');
const dbConn = require('../db_connection.js');

const queries = {};

const convertToEndpoint = (Text) => {
  return Text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

queries.getTopics = (cb) => {
  dbConn.query(
    'SELECT * from topics;', (err, data) => {
      if (err) cb(err);
      else cb(null, data.rows);
    }
  );
};

queries.getResources = (topicsEndpoint, cb) => {
  dbConn.query(`SELECT resources.title, url FROM resources
    LEFT OUTER JOIN topics ON (resources.topic_id=topics.id)
    WHERE topics.endpoint=$1`, [topicsEndpoint], (err, data) => {
      if (err) cb(err);
      else cb(null, data.rows);
    }
  );
};

queries.createResource = (payload, cb) => {
  console.log(payload);
  var endpoint = convertToEndpoint(payload.title);
  var values = [payload.title, payload.url, payload.topicid, payload.typeid, payload.userid, endpoint];
  var sql = `INSERT INTO resources(title, url, topic_id, type_id, user_id, endpoint)
  VALUES ($1, $2, $3, $4, $5, $6)`;
  dbConn.query(sql, values, (err) => {
    if (err) cb(err);
    else {
      var redirect = '/'; //later redirect to the resource that was created?
      cb(null, redirect);
    }
  });
};

queries.checkLogin = (payload, cb) => {
  const username = payload.username;
  const password = payload.password;
  const values = [payload.username];
  const sql = `SELECT * FROM users WHERE username = $1`;
  dbConn.query(sql, values, (err, data) => {
    if (err || data.rows.length === 0) cb(err);
    else {
      const userInfo = data.rows[0];
      Bcrypt.compare(password, userInfo.password, (err, isMatch) => {
        if (err || !isMatch) cb(err);
        cb(null, userInfo);
      });
    }
  });
};

queries.registerUser = (payload, cb) => {
  if (payload.password1 !== payload.password2) cb(`passwords don't match`);
  else {
    Bcrypt.hash(payload.password1, 10, (err, hash) => {
      const values = [payload.firstname, payload.lastname, payload.github, payload.email, payload.username, hash];
      const sql = `INSERT INTO users(firstname, lastname, github, email, username, password) VALUES
                  ($1, $2, $3, $4, $5, $6) RETURNING id, username`;
      dbConn.query(sql, values, (err, data) => {
        if (err) cb(err);
        else {
          var userinfo = data.rows[0];
          cb(null, userinfo);
        }
      });
    });
  }
};

module.exports = queries;
