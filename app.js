const express = require('express');

const app = express();

const mongoose = require('mongoose');

const { PORT = 3000, NODE_ENV, MONGO_DB } = process.env;

const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const { errors } = require('celebrate');

const router = require('./routes/index');

const limiter = require('./middlewares/limiter');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { serverErrorHandler } = require('./middlewares/serverErrorHandler');

mongoose.connect(NODE_ENV === 'production' ? MONGO_DB : 'mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => {
    console.log('MongoDB is connected');
  });

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

app.use(requestLogger);

app.use(limiter);

app.use(router);

app.use(errors());

app.use(serverErrorHandler);

app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
