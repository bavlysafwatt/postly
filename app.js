const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const qs = require('qs');

const { globalError } = require('./src/middleware/error.middleware');
const AppError = require('./src/utils/AppError.utils');
const { uploadSingleFile } = require('./src/middleware/upload.middleware');

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

app.post('/api/v1/uploadPhoto', uploadSingleFile('photo', 'posts'), (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            file: req.file.path
        }
    });
});

app.all('/{*any}', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);

module.exports = app;