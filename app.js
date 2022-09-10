const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const { errors } = require('celebrate');

const { PORT, DATABASE_URL } = require('./tokenGeneration');

const { NOT_FOUND_ERROR } = require('./errors/notFoundError');
const { internalServerError } = require('./middlewares/internalServerError');
const { auth } = require('./middlewares/auth');
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { limiter } = require('./utils/rateLimit');

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(cors);

app.use(require('./routes/login'));

app.use(auth);

app.use(require('./routes/user'));
app.use(require('./routes/movie'));

app.use((req, res, next) => {
  next(new NOT_FOUND_ERROR('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use(internalServerError);

async function main() {
  await mongoose.connect(DATABASE_URL);
  console.log('Connect to db');

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

main();
