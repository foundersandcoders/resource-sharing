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
<<<<<<< HEAD
  dbConn.query(`SELECT resources.title, url, resources.endpoint FROM resources
=======
  dbConn.query(`SELECT resources.title, resources.endpoint, url FROM resources
>>>>>>> 0509e2304ce2a85ba8e54b5b37801ffd1c4f2acc
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
      var redirect = '/'; // later redirect to the resource that was created?
<<<<<<< HEAD
=======
      cb(null, redirect);
    }
  });
};

queries.createReview = (payload, cb) => {
  console.log(payload, 'review payload');
  var values = [payload.rating, payload.endpoint, payload.content, payload.userid];
  console.log(payload.endpoint);
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
      var topic = data.rows[0];
      var redirect = `/${topic.endpoint}/${payload.endpoint}`;
>>>>>>> 0509e2304ce2a85ba8e54b5b37801ffd1c4f2acc
      cb(null, redirect);
    }
  });
};

queries.getMyResource = (resourcesEndpoint, cb) => {
  dbConn.query(`SELECT url, resources.title AS resources_title, type.label, topics.title AS topics_title FROM resources
    LEFT OUTER JOIN topics ON topics.id=resources.topic_id LEFT OUTER JOIN type ON type.id=resources.type_id
    WHERE resources.endpoint=$1`, [resourcesEndpoint], (err, data) => {
      if (err) cb(err);
      else {
        cb(null, data.rows[0]);
      }
    }
  );
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
