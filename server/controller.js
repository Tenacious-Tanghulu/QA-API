const express = require('express');
const database = require('../database');
const router = express.Router();

// get
router.get('/questions/:productId', (req, res) => {
  const productId = req.params.productId;
  database.selectQuestionsByProduct(productId);
  res.end();
});

router.get('/questions/:questionId/answers', (req, res) => {
  const questionId = req.params.questionId;
  database.selectAnswersByQuestion(questionId);
  res.end();
});

// post
// router.post('/questions', (req, res) => ());
// router.post('/questions/:questionId/answers', (req, res) => ());

// put

module.exports = router;
