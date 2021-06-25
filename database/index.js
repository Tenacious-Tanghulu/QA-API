const { Pool } = require('pg');
const config = require('./config.js');

const pool = new Pool(config);

module.exports = {
  selectQuestionsByProduct: (productId) => (
    pool
      .query(`select id, body, date_written, asker_name, helpful, reported from questions where product_id = ${productId}`)
      .then(res => console.log(res.rows[0]))
      .catch(err => console.error('Error executing query', err.stack))
  ),

  selectAnswersByQuestion: (questionId) => (
  pool
      .query(`select id, body, date_written, answerer_name, helpful, reported from answers where question_id = ${questionId}`)
      .then(res => console.log(res.rows[0]))
      .catch(err => console.error('Error executing query', err.stack))
  )

  // insertQuestionByProduct: () => (),

  // insertAnswerByQuestion: () => (),

  // updateQuestionHelpful: () => (),

  // updateQuestionReport: () => (),

  // updateAnswerHelpful: () => (),

  // updateAnswerReport: () => ()
}
