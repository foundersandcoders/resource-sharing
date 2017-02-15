const Bcrypt = require('bcrypt');
const dbConn = require('../db_connection.js');

const queries = {};

const convertToEndpoint = (Text) => {
  return Text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

queries.checkLogin = (payload, cb) => {
  const sql = `SELECT * FROM users WHERE username = $1`;
  const values = [payload.username];
  dbConn.query(sql, values, (err, data) => {
    if (err || data.rows.length === 0) cb(err);
    else {
      const userInfo = data.rows[0];
      Bcrypt.compare(payload.password, userInfo.password, (err, isMatch) => {
        if (err) cb(err);
        else if (!isMatch) {
          cb(null, false);
        } else {
          cb(null, userInfo);
        }
      });
    }
  });
};

queries.registerUser = (payload, cb) => {
  if (payload.password1 !== payload.password2) cb(`passwords don't match`);
  else {
    Bcrypt.hash(payload.password1, 10, (err, hash) => {
      const sql = `INSERT INTO users(firstname, lastname, github, email, username, password)
                             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username`;
      const values = [payload.firstname, payload.lastname, payload.github, payload.email, payload.username, hash];
      dbConn.query(sql, values, (err, data) => {
        if (err) {
          cb(err);
        }
        else {
          const userinfo = data.rows[0];
          cb(null, userinfo);
        }
      });
    });
  }
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
  const sql = `SELECT resources.title, resources.endpoint, url, topics.endpoint AS topics_endpoint,
               (SELECT COUNT(*) FROM reviews WHERE reviews.resource_id = resources.id) AS reviews_count,
               (SELECT AVG(rating) FROM reviews WHERE reviews.resource_id = resources.id)::int AS reviews_avg,
               (EXISTS (SELECT * FROM reviews WHERE reviews.resource_id = resources.id)) AS has_reviews
               FROM resources LEFT OUTER JOIN topics ON (resources.topic_id=topics.id)
               WHERE topics.endpoint=$1`;
  dbConn.query(sql, [topicsEndpoint], (err, data) => {
    if (err) cb(err);
    else cb(null, data.rows);
  }
  );
};

queries.createResource = (payload, cb) => {
  console.log(payload);
  const endpoint = convertToEndpoint(payload.title);
  const sql = `INSERT INTO resources(title, url, topic_id, type_id, user_id, endpoint)
  VALUES ($1, $2, $3, $4, $5, $6)`;
  var values = [payload.title, payload.url, payload.topicid, payload.typeid, payload.userid, endpoint];
  dbConn.query(sql, values, (err) => {
    if (err) cb(err);
    else {
      var redirect = '/'; // later redirect to the resource that was created?
      cb(null, redirect);
    }
  });
};

queries.getMyResource = (resourcesEndpoint, cb) => {
  dbConn.query(`SELECT url, resources.id AS resources_id, resources.title AS resources_title, type.label, topics.id AS topics_id, topics.title AS topics_title FROM resources
    LEFT OUTER JOIN topics ON topics.id=resources.topic_id LEFT OUTER JOIN type ON type.id=resources.type_id
    WHERE resources.endpoint=$1`, [resourcesEndpoint], (err, data) => {
      if (err) cb(err);
      else {
        cb(null, data.rows[0]);
      }
    }
  );
};

queries.updateMyResource = (payload, cb) => {
  console.log(payload);
  var endpoint = convertToEndpoint(payload.topictitle);
  console.log(endpoint);
  var values = [payload.topictitle, payload.url, payload.topicid, payload.typeid, endpoint, payload.resourceid];
  var sql = `UPDATE resources SET title = $1, url = $2, topic_id = $3, type_id = $4, endpoint = $5 WHERE resources.id=$6`;
  dbConn.query(sql, values, (err) => {
    if (err) cb(err);
    else {
      var redirect = '/'; // later redirect to the resource that was updated and/or note that it was updated?
      cb(null, redirect);
    }
  });
};

queries.getReviews = (resourcesEndpoint, cb) => {
  const sql = `SELECT * FROM reviews
  LEFT OUTER JOIN resources ON (reviews.resource_id = resources.id)
  WHERE resources.endpoint=$1`;
  const values = [resourcesEndpoint];
  dbConn.query(sql, values, (err, data) => {
    if (err) cb(err);
    else {
      if (data.rows.length !== 0) var title = data.rows[0].title;
      else var title = 'There are no reviews for this Resource yet... add one?';
      cb(null, data.rows, title);
    }
  });
};

queries.createReview = (payload, cb) => {
  const sql = `INSERT INTO reviews(rating, resource_id, content, user_id)
              VALUES ($1, (SELECT id FROM resources WHERE endpoint = $2), $3, $4)
              RETURNING (
                SELECT endpoint FROM topics WHERE id = (
                  SELECT topic_id FROM resources WHERE id = resource_id
                )
              )`;
  const values = [payload.rating, payload.endpoint, payload.content, payload.userid];
  dbConn.query(sql, values, (err, data) => {
    if (err) cb(err);
    else {
      var topic = data.rows[0];
      var redirect = `/${topic.endpoint}/${payload.endpoint}`;
      cb(null, redirect);
    }
  });
};

queries.getReviewsByUser = (username, cb) => {
  const sql = 'SELECT * FROM reviews LEFT OUTER JOIN resources ON reviews.resource_id = resources.id LEFT OUTER JOIN users ON reviews.user_id = users.id WHERE username = $1;';
  const values = [username];
  dbConn.query(sql, values, (err, data) => {
    if (err) cb(err);
    else cb(null, data.rows);
  });
};

module.exports = queries;
