import express from 'express';
import shazamFactory from '../app';

const app = express();

const shazam = shazamFactory({
    api: {
        name: 'My App',
        version: 1
    }
});

// Activate the process exception handlers
shazam.handler;

// Add logging middleware
app.use(shazam.log);

app.get('/undefined', (req, res, next) => {
    throw new ReferenceError('blablabla is not defined');
});

app.get('/promise', (req, res, next) => {
    return new Promise((resolve, reject) => {
        reject(new ReferenceError('promiseError is not defined'));
    }).catch(next);
});

// Register exception middleware to format the 500 error response
app.use(shazam.exception);

export default app;