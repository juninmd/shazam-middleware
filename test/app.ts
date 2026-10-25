import express from 'express';
import shazamFactory from '../app';

const app = express();

const shazam = shazamFactory({
    api: {
        name: 'My App',
        version: 1
    },
    slack: {
        token: 'fake-token',
        channel: 'fake-channel'
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

app.get('/a', (req, res, next) => {
    next('boom');
});

app.get('/b', (req, res, next) => {
    next({ statusCode: 99, message: 'x' });
});

app.get('/empty-obj', (req, res, next) => {
    next({});
});

app.get('/null', (req, res, next) => {
    shazam.exception(null, req, res, next);
});

app.get('/error-x', (req, res, next) => {
    next(new Error('x'));
});

app.get('/status-abc', (req, res, next) => {
    next({ statusCode: 'abc', message: 'invalid status string' });
});

app.get('/status-700', (req, res, next) => {
    next({ statusCode: 700, message: 'out of range status' });
});

app.get('/headers-sent', (req, res, next) => {
    res.write('partial response');
    next(new Error('error after headers sent'));
});

// Register exception middleware to format the 500 error response
app.use(shazam.exception);

export default app;
