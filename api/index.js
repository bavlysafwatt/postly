require('dotenv').config();

const mongoose = require('mongoose');
const app = require('../app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.PASSWORD
);

mongoose.connect(DB, {
    autoIndex: true,
})
    .then(() => console.log('DB connection successful!'))
    .catch((err) => {
        console.error('DB connection error:', err);
    });

module.exports = app;