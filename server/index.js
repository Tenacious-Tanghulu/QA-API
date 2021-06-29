const express = require('express');
const router = require('./server.js');
const app = express();
const port = 3000;

app.use(express.json());
app.use('/qa', router);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
