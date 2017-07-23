# shazam-middleware

[![NPM Version](https://img.shields.io/npm/v/shazam-middleware.svg)](https://npmjs.org/package/shazam-middleware)
[![NPM Downloads](https://img.shields.io/npm/dm/shazam-middleware.svg)](https://npmjs.org/package/shazam-middleware)
[![GitHub issues](https://img.shields.io/github/issues/juninmd/shazam-middleware.svg)](https://github.com/juninmd/shazam-middleware/issues)
[![GitHub forks](https://img.shields.io/github/forks/juninmd/shazam-middleware.svg)](https://github.com/juninmd/shazam-middleware/network)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/juninmd/shazam-middleware.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)

## What is shazam?
* Shazam it's a `express` middleware to print on console of your application. His difference is that it notify the slack channel when occurs errors without validation.

## Requirements
* [Node](https://nodejs.org/en/)
* [Express](https://www.npmjs.com/package/express)

## Installation
```bash
npm install --save shazam-middleware
```

## Code Example
```js
const app = require('express')();
const package = require('./package.json');
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
        version: package.version
    }
});

app.use(shazam.log);

// Look Here, one route with error
app.get("/error", (req, res, next) => {
    travel
    res.status(200).send({ retorno: 'ok' })
})

app.use(shazam.exception);

app.listen(4600, () => {
    console.log('APP WORKS http://localhost:4600')
})

```

## Example of console log
![alt text](https://image.prntscr.com/image/3KmzXvsjQfC-6TfHrMwx1A.png "Log Exemple")

## Return of JSON
![alt text](https://image.prntscr.com/image/ATA3JtYjSs6MzIsQKBSE2Q.png "Log Exemple")

