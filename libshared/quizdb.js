// PostgreSQL database methods
import pg from 'pg';

// data type parsers
pg.types.setTypeParser(pg.types.builtins.INT2, v => parseInt(v, 10));
pg.types.setTypeParser(pg.types.builtins.INT4, v => parseInt(v, 10));
pg.types.setTypeParser(pg.types.builtins.INT8, v => parseFloat(v));

const pool = new pg.Pool({
  host: process.env.POSTGRES_SERVER,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_QUIZUSER,
  password: process.env.POSTGRES_QUIZPASS
});


// count questions in database
export async function questionCount() {

  const res = await query('SELECT COUNT(1) FROM question;');
  return res?.[0]?.count;

}


// add a new question and answer set
export async function questionAdd(question, answer) {

  const client = await pool.connect();
  let commit = false;

  try {

    // new transaction
    await client.query('BEGIN');

    // add question
    const q = await client.query('INSERT INTO question(text) VALUES($1) RETURNING id;', [ question ]);

    if (q.rowCount === 1) {

      // question id
      const qId = q.rows[0].id;

      // insert answers in sequence
      let inserted = 0;
      for (let item of answer) {

        const a = await client.query(
          'INSERT INTO answer(question_id, text, correct) VALUES($1, $2, $3);',
          [ qId, item.text, item.correct ]
        );

        inserted += a.rowCount || 0;

      }

      // answers added?
      commit = inserted === answer.length;

    }

  }
  catch(err) {
    // database error
  }
  finally {

    // commit or rollback transaction
    if (commit) {
      await client.query('COMMIT');
    }
    else {
      await client.query('ROLLBACK');
    }

    client.release();
  }

  return commit;

}


// database query
async function query(sql, arg = []) {

  const client = await pool.connect();

  try {
    const result = await client.query(sql, arg);
    return result && result.rows;
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.release();
  }

}
