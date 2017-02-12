const dbConn = require('../db_connection.js');

const _ = {};

const clearTable = (table) => {
  return new Promise((resolve, reject) => {
    dbConn.query(
      `DELETE FROM ${table};`, (err) => {
        if (err) reject(err);
        else resolve('success');
      }
    );
  });
};

// clear tables in order of dependencies
_.clearTables = () =>
  clearTable('reviews')
  .then(() => clearTable('resources'))
  .then(() => Promise.all([
    'topics',
    'type',
    'users'
  ].map(clearTable)));

_.teardown = () => _.clearTables()
  .then(() => dbConn.end());

_.get = (table) => {
  return new Promise((resolve, reject) => {
    dbConn.query(
      `SELECT * FROM ${table};`, (err, data) => {
        if (err) reject(err);
        else resolve(data.rows);
      }
    );
  });
};

_.getWhere = (table, column, input) => {
  return new Promise((resolve, reject) => {
    dbConn.query(
      `SELECT * FROM ${table} WHERE $1 = $2`, [column, input], (err, data) => {
        if (err) reject(err);
        else resolve(data.rows);
      });
  });
};

module.exports = _;
