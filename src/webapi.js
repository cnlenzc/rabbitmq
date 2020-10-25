//webapi.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const queue = require("./queue");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();

router.post('/task', (req, res) => {
  queue.sendToQueue("fila1", req.body);
  res.json({ message: 'Your request will be processed!' });
});

app.use('/', router);

app.listen(3000);
