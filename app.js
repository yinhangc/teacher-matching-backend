const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE).then((con) => {
  console.log('Successfully connected to mongoDB!');
});

const express = require('express');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const postsRouter = require('./routes/postsRoutes');
const usersRouter = require('./routes/usersRoutes');

app.use(express.json());
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
