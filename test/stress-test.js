import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 1000 }, // below normal load
    { duration: '5s', target: 200 },
    // { duration: '2m', target: 200 }, // normal load
    // { duration: '5m', target: 200 },
    // { duration: '2m', target: 300 }, // around the breaking point
    // { duration: '5m', target: 300 },
    // { duration: '2m', target: 400 }, // beyond the breaking point
    // { duration: '5m', target: 400 },
    { duration: '3s', target: 0 }, // scale down. Recovery stage.
  ],
};

export default function () {
  const BASE_URL = 'http://localhost:3000/qa'; // make sure this is not production
  const max = 10000;
  let productId = Math.floor(Math.random() * max) || 1;
  let questionId = Math.floor(Math.random() * max) || 1;

  let responses = http.batch([
    [
      'GET',
      `${BASE_URL}/questions/${productId}`,
      null,
      { tags: { name: 'GetAllQuestions' } },
    ],
    [
      'GET',
      `${BASE_URL}/questions/${questionId}/answers`,
      null,
      { tags: { name: 'GetAllAnswers' } },
    ]
  ]);

  sleep(1);
}
