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
  var values = [payload.title, payload.url, payload.topic, payload.typeid, 1, endpoint];
  var sql = `INSERT INTO resources(title, url, topic_id, type_id, user_id, endpoint)
  VALUES ($1, $2, (SELECT id FROM topics WHERE endpoint = $3), $4, $5, $6)`;
  dbConn.query(sql, values, (err) => {
    if (err) cb(err);
    else {
      var redirect = `/${payload.topic}/${endpoint}`;
      cb(null, redirect);
    }
  });
};

queries.checkLogin = (payload, cb) => {
  const username = payload.username;
  const password = payload.password;
  const values = [payload.username];
  const sql = `SELECT * FROM users WHERE username = $1`;
  dbConn.query(sql, data, (err) => {
    if (err) cb(err);
    const result = data.rows[0];
    Bcrypt.compare(password, result.password, (err, isMatch) => {
      if (err) cb(err);
      cb(null, isMatch);
    });
  });
};

module.exports = queries;
