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
      const data = {
        product_id: productId.toString(),
        results: questions
      }
      res.status(200).send(data);
    })
    .catch(err => console.error('Query execution', err.stack))
});

// router.get('/questions/:questionId/answers', (req, res) => {
//   const questionId = req.params.questionId;
//   // const page = req.params.page;
//   // const count = req.params.count;
//   const answers = [];
//   database.selectAnswersByQuestion_2(questionId)
//     .then(result => {
//       const promises = result.rows.map(answer => {
//         answers.push(answer);
//         return database.selectPhotosByAnswer(answer.answer_id);
//       });
//       return Promise.all(promises);
//     })
//     .then(result => {
//       answers.forEach((answer, index) => answer.photos = result[index].rows);
//       const data = {
//         question: questionId.toString(),
//         // page: page,
//         // count: count,
//         results: answers
//       }
//       res.status(200).send(data);
//     })
//     .catch(err => console.error('Query execution', err.stack))
// });

router.get('/questions/:questionId/answers', (req, res) => {
  const questionId = req.params.questionId;
  // const page = req.params.page;
  // const count = req.params.count;
  const answers = [];
  database.selectAnswersByQuestion(questionId)
    .then(result => {
      res.status(200).send(result.rows);
    })
    .catch(err => console.error('Query execution', err.stack))
});

// post requests
router.post('/questions', (req, res) => {
  const productId = req.body.product_id;
  const { body, name, email } = req.body;
  database.insertQuestionByProduct(productId, body, name, email)
    .then(result => res.status(201).end())
    .catch(err => console.error('Query execution', err.stack))
});

// router.post('/questions/:questionId/answers', (req, res) => ());
// router.post('/questions/:questionId/answers', (req, res) => {
//   const questionId = req.params.questionId;
//   const { body, name, email } = req.body;
//   const photoUrl = req.body.photo_url;
//   database.insertAnswerByQuestion(questionId, body, name, email)
//     .then(result => {

//     })
//     .catch(err => console.error('Query execution', err.stack))
//   res.end();
// });

// put requests
// router.put('/questions/:question_id/helpful', (req, res) => ());
// router.put('/questions/:question_id/report', (req, res) => ());
// router.put('/answers/:answer_id/helpful', (req, res) => ());
// router.put('/answers/:answer_id/report', (req, res) => ());

module.exports = router;
