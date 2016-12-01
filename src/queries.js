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
  dbConn.query(`SELECT resources.title, resources.endpoint, url FROM resources
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

queries.createReview = (payload, cb) => {
  console.log(payload, "review payload");
  var values = [payload.rating, payload.endpoint, payload.content, payload.userid]
  var sql = `INSERT INTO reviews(rating, resource_id, content, user_id)
              VALUES ($1, (SELECT id FROM resources WHERE endpoint = $2), $3, $4)
              RETURNING (
                SELECT endpoint FROM topics WHERE id = (
                  SELECT topic_id FROM resources WHERE id = resource_id
                )
              )`;
  dbConn.query(sql, values, (err, data) => {
    if (err) cb(err);
    else {
      var topicEndpoint = data.rows[0];
      var redirect = `/${topicEndpoint}/${payload.endpoint}`;
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
      const result = data.rows[0];
      Bcrypt.compare(password, result.password, (err, isMatch) => {
        if (err) cb(err);
        cb(null, isMatch);
      });
    }
  });
};

module.exports = queries;
