const { Pool } = require('pg');
const config = require('./config.js');

const pool = new Pool(config);

module.exports = {
  // selectQuestionsByProduct: productId => pool.query('SELECT id AS question_id, body AS question_body, date_written AS question_date, asker_name, helpful AS question_helpfulness, reported FROM questions WHERE product_id = ($1)', [productId]),

  // selectAnswersByQuestion_1: questionId => pool.query('SELECT id, body, date_written AS date, answerer_name, helpful AS helpfulness FROM answers WHERE question_id = ($1)', [questionId]),

  // selectAnswersByQuestion_2: questionId => pool.query('SELECT id AS answer_id, body, date_written AS date, answerer_name, helpful AS helpfulness FROM answers WHERE question_id = ($1)', [questionId]),

  // selectPhotosByAnswer: answerId => pool.query('SELECT id, photo_url AS url FROM photos WHERE answer_id = ($1)', [answerId]),

  selectAnswersByQuestion: questionId => pool.query(queryString),

  insertQuestionByProduct: (productId, body, name, email) => pool.query('INSERT INTO temp_questions (product_id, body, date_written, asker_name, asker_email) VALUES (($1), ($2), current_timestamp, ($3), ($4))', [productId, body, name, email]),

  insertAnswerByQuestion: (questionId, body, name, email) => pool.query('INSERT INTO temp_answers (question_id, body, date_written, answerer_name, answerer_email) VALUES (($1), ($2), current_timestamp, ($3), ($4))', [questionId, body, name, email]),

  insertPhotoByAnswer: (answerId, photoUrl) => pool.query('INSERT INTO temp_photos (answer_id, photo_url) VALUES (($1), ($2))', [answerId, photo_url])

  // updateQuestionHelpful: () => (),

  // updateQuestionReport: () => (),

  // updateAnswerHelpful: () => (),

  // updateAnswerReport: () => ()
}

const queryString = 'SELECT answers.id, answers.body, answers.date_written AS date, answers.answerer_name, answers.helpful as helpfulness, COALESCE(json_agg(json_build_object(\'id\', photos.id, \'url\', photos.photo_url)) FILTER (WHERE photos.id IS NOT NULL), \'[]\') AS photos FROM answers LEFT JOIN photos ON answers.id = photos.answer_id WHERE answers.question_id = 1 GROUP BY answers.id;'