const express = require('express');
const database = require('../database');
const router = express.Router();

// get requests
router.get('/questions/:productId', (req, res) => {
  const productId = req.params.productId;
  const questions = [];
  database.selectQuestionsByProduct(productId)
    .then(result => {
      const promises = result.rows.map(question => {
        questions.push(question);
        return database.selectAnswersByQuestion_1(question.question_id);
      });
      return Promise.all(promises);
    })
    .then(result => {
      const answersArray = result.map(answers => answers.rows);
      const promisesArray = answersArray.map((answers, index) => {
        questions[index].answers = {};
        const promises = answers.map(answer => {
          questions[index].answers[answer.id] = answer;
          return database.selectPhotosByAnswer(answer.id);
        });
        return Promise.all(promises);
      });
      return Promise.all(promisesArray);
    })
    .then(result => {
      result.forEach((photos, questionIndex) => {
        const currQuestion = questions[questionIndex];
        const answerIds = Object.keys(currQuestion.answers);
        photos.forEach((photo, answerIndex) => {
          const answerId = answerIds[answerIndex];
          const currAnswer = currQuestion.answers[answerId];
          currAnswer.photos = photo.rows;
        });
      });
      res.status(200).send(questions);
    })
    .catch(err => console.error('Error executing query', err.stack))
});

router.get('/questions/:questionId/answers', (req, res) => {
  const questionId = req.params.questionId;
  const answers = [];
  database.selectAnswersByQuestion_2(questionId)
    .then(result => {
      const promises = result.rows.map(answer => {
        answers.push(answer);
        return database.selectPhotosByAnswer(answer.answer_id);
      });
      return Promise.all(promises);
    })
    .then(result => {
      answers.forEach((answer, index) => answer.photos = result[index].rows);
      res.status(200).send(answers);
    })
    .catch(err => console.error('Error executing query', err.stack))
});

// post requests
// router.post('/questions', (req, res) => ());
// router.post('/questions/:questionId/answers', (req, res) => ());

// put requests
// router.put('/questions/:question_id/helpful', (req, res) => ());
// router.put('/questions/:question_id/report', (req, res) => ());
// router.put('/answers/:answer_id/helpful', (req, res) => ());
// router.put('/answers/:answer_id/report', (req, res) => ());

module.exports = router;
