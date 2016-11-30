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

queries.createResource = (payload, cb) => {
  console.log(payload);
  const endpoint = convertToEndpoint(payload.title);
  const values = [payload.title, payload.url, payload.topic, payload.typeid, 1, endpoint];
  const sql = `INSERT INTO resources(title, url, topic_id, type_id, user_id, endpoint)
  VALUES ($1, $2, (SELECT id FROM topics WHERE endpoint = $3), $4, $5, $6)`;
  dbConn.query(sql, values, (err) => {
    if (err) cb(err);
    else {
      var redirect = `/${payload.topic}/${endpoint}`;
      cb(null, redirect);
    }
  });
};

queries.getReviewsByUser = (username, cb) => {
  const sql = 'SELECT * FROM reviews LEFT OUTER JOIN resources ON reviews.resource_id = resources.id LEFT OUTER JOIN users ON reviews.user_id = users.id WHERE username = $1;';
  const values = [username];
  dbConn.query(sql, values, (err, result) => {
    if (err) cb(err);
    else cb(null, result);
  });
};

module.exports = queries;
