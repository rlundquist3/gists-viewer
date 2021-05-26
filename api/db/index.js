const { Pool } = require('pg');

const pool = new Pool({
  user: 'gists',
  password: 'gists',
  host: 'localhost',
  database: 'apollo',
  port: 5432,
});

module.exports = {
  async query(query, params) {
    return pool.query(query, params);
  },
  async getClient() {
    return pool.connect();
  },
};
