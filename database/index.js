const { Pool } = require('pg');
const config = require('./config.js');

const pool = new Pool(config);

module.exports = {
  // selectQuestionsByProduct: productId => pool.query('SELECT id AS question_id, body AS question_body, date_written AS question_date, asker_name, helpful AS question_helpfulness, reported FROM questions WHERE product_id = ($1)', [productId]),

  // selectAnswersByQuestion_1: questionId => pool.query('SELECT id, body, date_written AS date, answerer_name, helpful AS helpfulness FROM answers WHERE question_id = ($1)', [questionId]),

  // selectAnswersByQuestion_2: questionId => pool.query('SELECT id AS answer_id, body, date_written AS date, answerer_name, helpful AS helpfulness FROM answers WHERE question_id = ($1)', [questionId]),

  // selectPhotosByAnswer: answerId => pool.query('SELECT id, photo_url AS url FROM photos WHERE answer_id = ($1)', [answerId]),

  selectQuestionsByProduct: (productId, page, count) => pool.query(
    `SELECT questions.id AS question_id, questions.body AS question_body, questions.date_written AS question_date, questions.asker_name, questions.helpful AS question_helpfulness, questions.reported,
      (SELECT COALESCE(json_agg(nested_answer) FILTER (WHERE nested_answer IS NOT NULL), '[]')
      FROM (
        SELECT
          answers.id,
          answers.body,
          answers.date_written AS date,
          answers.answerer_name,
          answers.helpful AS helpfulness,
          COALESCE(json_agg(json_build_object('id', photos.id, 'url', photos.photo_url)) FILTER (WHERE photos.id IS NOT NULL), '[]') AS photos
        FROM answers LEFT JOIN photos ON answers.id = photos.answer_id
        WHERE answers.question_id = questions.id
        GROUP BY answers.id
      ) AS nested_answer
      ) AS answers
    FROM questions LEFT JOIN answers ON questions.id = answers.question_id
    WHERE questions.product_id = ($1)
    GROUP BY questions.id`, [productId]),

  selectAnswersByQuestion: (questionId, page, count) => pool.query(
    `SELECT answers.id AS answer_id, answers.body, answers.date_written, answers.answerer_name, answers.helpful AS helpfulness,
      COALESCE(json_agg(json_build_object('id', photos.id, 'url', photos.photo_url)) FILTER (WHERE photos.id IS NOT NULL), '[]') AS photos
    FROM answers LEFT JOIN photos ON answers.id = photos.answer_id
    WHERE answers.question_id = ($1)
    GROUP BY answers.id`, [questionId]),

  insertQuestionByProduct: (productId, body, name, email) => pool.query(
    `INSERT INTO questions (product_id, body, date_written, asker_name, asker_email)
    VALUES (($1), ($2), current_timestamp, ($3), ($4))`, [productId, body, name, email]),

  insertAnswerByQuestion: (questionId, body, name, email, photoUrl) => pool.query(
    `WITH new_answer AS (
      INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email)
      VALUES (($1), ($2), current_timestamp, ($3), ($4))
      RETURNING id
    )
    INSERT INTO photos (answer_id, photo_url)
    VALUES ((SELECT * FROM new_answer), ($5))`, [questionId, body, name, email, photoUrl])

  // updateQuestionHelpful: () => (),

  // updateQuestionReport: () => (),

  // updateAnswerHelpful: () => (),

  // updateAnswerReport: () => ()
}
