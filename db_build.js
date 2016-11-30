const fs = require('fs');

const buildDatabase = (cb) => {
  const connection = require('./db_connection');

  const sql = fs.readFileSync(`${__dirname}/db_build.sql`).toString();

  connection.query(sql, (err, result) => {
    if (err) {
      cb(err);
    } else {
      cb(null, result);
    }
  });
};

module.exports = buildDatabase;
