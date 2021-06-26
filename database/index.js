const { Pool } = require('pg');
const config = require('./config.js');

const pool = new Pool(config);

module.exports = {
  selectQuestionsByProduct: productId => pool.query(`SELECT id AS question_id, body AS question_body, date_written AS question_date, asker_name, helpful AS question_helpfulness, reported FROM questions WHERE product_id = ${productId}`),

  selectAnswersByQuestion: questionId => pool.query(`SELECT id AS answer_id, body, date_written AS date, answerer_name, helpful AS helpfulness FROM answers WHERE question_id = ${questionId}`),

  selectPhotosByAnswer: answerId => pool.query(`SELECT id, photo_url AS url FROM photos WHERE answer_id = ${answerId}`)

  // insertQuestionByProduct: () => (),

  // insertAnswerByQuestion: () => (),

  // updateQuestionHelpful: () => (),

  // updateQuestionReport: () => (),

  // updateAnswerHelpful: () => (),

  // updateAnswerReport: () => ()
}
