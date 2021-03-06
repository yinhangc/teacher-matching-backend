// const dotenv = require('dotenv');
// dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
mongoose.connect(process.env.DB).then((con) => {
  if (process.env.NODE_ENV === 'development')
    console.log('Successfully connected to mongoDB!');
});
const cors = require('cors');
const path = require('path');
const xss = require('xss-clean');
const express = require('express');
const morgan = require('morgan');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const postsRouter = require('./routes/postsRoutes');
const usersRouter = require('./routes/usersRoutes');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(xss());
app.use(express.json());
app.use('/image', express.static(path.join('public', 'img')));
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`找不到${req.originalUrl}`, 404));
});
app.use(globalErrorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  if (process.env.NODE_ENV === 'development')
    console.log(`App running on port ${port}...`);
});
