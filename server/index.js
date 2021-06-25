const express = require('express');
const router = require('./controller.js');
const app = express();
const port = 3000;

app.use('/qa', router);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
