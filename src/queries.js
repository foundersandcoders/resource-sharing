const dbConn = require('../db_connection.js');

const queries = {};

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

module.exports = queries;
