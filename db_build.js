const env = require('env2');
const fs = require('fs');

const buildDatabase = (cb) => {
  env('./config.env');

  const connection = require('./db_connection');

  const sql = fs.readFileSync(`${__dirname}/db_build.sql`).toString();

  connection.query(sql, (err, cb) => {
    if (err) {
      console.log('Error', err);
    } else {
      cb();
    }
  });
};

module.exports = buildDatabase;
