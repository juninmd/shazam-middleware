# shazam-middleware

[![NPM Version](https://img.shields.io/npm/v/shazam-middleware.svg)](https://npmjs.org/package/shazam-middleware)
[![NPM Downloads](https://img.shields.io/npm/dm/shazam-middleware.svg)](https://npmjs.org/package/shazam-middleware)
[![GitHub issues](https://img.shields.io/github/issues/juninmd/shazam-middleware.svg)](https://github.com/juninmd/shazam-middleware/issues)
[![GitHub forks](https://img.shields.io/github/forks/juninmd/shazam-middleware.svg)](https://github.com/juninmd/shazam-middleware/network)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/juninmd/shazam-middleware.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)

## What is shazam?
* Shazam it's a `express` middleware to print on console of your application your requests. His difference is that it notify the slack channel when occurs errors.

## Requirements
* [Node](https://nodejs.org/en/)
* [Express](https://www.npmjs.com/package/express)

## Installation
```bash
npm install --save shazam-middleware
```
or
```bash
yarn add shazam-middleware
```

## I Recomend this patern on errors
```js
  app.get("/error/next", (req, res, next) => {
        next({
            message: {
                userMessage: 'Hey, user! Don´t Worry',
                developerMessage: 'Hey Man! This is bad'
            },
            statusCode: 500
        });
    })
```

## Code Example
```js
const app = require('express')();
// Don't forget to configure the paramters
const shazam = require('shazam-middleware')({
    slack: {
        urlHook: process.env.urlHook,
        channel: process.env.channel,
        iconUrl: process.env.iconUrl,
        botusername: process.env.botusername
    },
    api: {
        name: 'My App',
        version: 1
    }
});

// Activate Validations on process `uncaughtException` and `unhandledRejection`
shazam.handler;

// Now, we wanna log all requests
app.use(shazam.log);

// Look Here, one route with error
app.get("/error", (req, res, next) => {
    batata
    res.status(200).send({ retorno: 'ok' })
})

// Now, we will look for all exceptions from routes
app.use(shazam.exception);

app.listen(4600, () => {
    console.log('APP WORKS http://localhost:4600')
})

```

## Example of log
![alt text](https://image.prntscr.com/image/3KmzXvsjQfC-6TfHrMwx1A.png "Log Exemple")

## Example of response
![alt text](https://image.prntscr.com/image/ATA3JtYjSs6MzIsQKBSE2Q.png "Log Exemple")

## Example on Slack
![alt text](https://image.prntscr.com/image/ATA3JtYjSs6MzIsQKBSE2Q.png "Log Exemple")