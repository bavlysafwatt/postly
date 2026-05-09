const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const qs = require('qs');

const { globalError } = require('./src/middleware/error.middleware');
const AppError = require('./src/utils/AppError.utils');
const authRoutes = require('./src/modules/auth/auth.routes');
const userRoutes = require('./src/modules/user/user.routes');
const postRoutes = require('./src/modules/post/post.routes');

const app = express();

app.set('query parser', (str) => qs.parse(str));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);

app.all('/{*any}', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);

module.exports = app;