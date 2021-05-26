const { Pool } = require('pg');

const pool = new Pool({
  user: 'gists',
  password: 'gists',
  host: 'localhost',
  database: 'apollo',
  port: 5432,
});

(async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DROP TABLE IF EXISTS favorite_gists');

    const tableSetupText =
      'CREATE TABLE favorite_gists(id INT GENERATED ALWAYS AS IDENTITY, gist_id TEXT UNIQUE, favorited BOOLEAN)';
    const res = await client.query(tableSetupText);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
})().catch((error) => console.error(error));
