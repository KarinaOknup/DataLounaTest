import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'postgres',
  password: 'root',
  port: 5432,
});

const db = {
  query: async (text: string, params?: any[]) => {
    const result = await pool.query(text, params);
    return result.rows;
  },
  transaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN'); 
      const result = await callback(client); 
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error:', err);
      throw err;
    } finally {
      client.release();
    }
  },
};

pool.on('error', (err) => {
  console.error('Connection error with PostgreSQL:', err);
});

export default db;