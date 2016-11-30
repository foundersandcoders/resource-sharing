const dbConn = require('../db_connection.js');

const queries = {};

const convertToEndpoint = (Text) => {
  return Text
    .toLowerCase()
    .replace(/ /g,'-')
    .replace(/[^\w-]+/g,'');
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
  var endpoint = convertToEndpoint(payload.title);
  var values = [payload.title, payload.url, payload.topic, payload.typeid, 1, endpoint];
  var sql = `INSERT INTO resources(title, url, topic_id, type_id, user_id, endpoint)
  VALUES ($1, $2, (SELECT id FROM topics WHERE endpoint = $3), $4, $5, $6)`
  dbConn.query(sql, values, (err) => {
    if(err) cb(err);
    else {
      var redirect = `/${payload.topic}/${endpoint}`;
      cb(null, redirect);
    }
  });
};



module.exports = queries;
