# shazam-middleware

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b0b7ea850b264e3cbd8c9e1b10e565c6)](https://www.codacy.com/app/jr_acn/shazam-middleware?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=juninmd/shazam-middleware&amp;utm_campaign=Badge_Grade)
[![NPM Version](https://img.shields.io/npm/v/shazam-middleware.svg)](https://npmjs.org/package/shazam-middleware)
[![NPM Downloads](https://img.shields.io/npm/dm/shazam-middleware.svg)](https://npmjs.org/package/shazam-middleware)
[![GitHub issues](https://img.shields.io/github/issues/juninmd/shazam-middleware.svg)](https://github.com/juninmd/shazam-middleware/issues)
[![GitHub forks](https://img.shields.io/github/forks/juninmd/shazam-middleware.svg)](https://github.com/juninmd/shazam-middleware/network)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/juninmd/shazam-middleware.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)

## What is shazam?
* Shazam it's a `express` middleware.

## What he does?
* HTTP request logger like `morgan` (Method, Status Code, Browser, IP)
* Notify on slack channel when errors occurs.

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

## Slack
* Activate webhook on slack, to get your UrlHook :D
* https://{yourslackname}.slack.com/apps/A0F7XDUAZ-incoming-webhooks
* Doc:  https://api.slack.com/incoming-webhooks

## Paramters Configuration
```js
 slack: {
        urlHook: '' // Url Hook of your slack,
        channel: '' // Name of your channel (Without '#'),
        iconUrl: '' // Customize the icon of bot (default: "http://dclegends.wiki/images/d/d9/Shazam_Billy_Batson_Portrait.png"),
        botusername: '' // Customize the name of bot (default: Shazam)
    },
    api: {
        name: '' // Name of your api,
        version: '' // Version of your api
    }
```

## Code example to do the Magic! (Automatic)
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

// Activate validation on process `uncaughtException` and `unhandledRejection`
shazam.handler;

// Now, we wanna log all requests
app.use(shazam.log);

// Look Here, one route with error
app.get("/error", (req, res, next) => {
    batata
    res.status(200).send({ retorno: 'ok' })
})

// Now, we will look for all exceptions from ours routes
app.use(shazam.exception);

// Start the Server
app.listen(4600, () => {
    console.log('APP WORKS http://localhost:4600')
})

// Fine! It`s All!
```

## If you return a object like this patern, and use next(), you can trigger the message on Slack Channel.
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
## Example of error log
![alt text](https://image.prntscr.com/image/uB86RZutR9O0fzM34J96HA.png "Log Exemple")

## Example of log
![alt text](https://image.prntscr.com/image/O9pnCJetQJ6Tkob4H31mMQ.png "Log Exemple")

## Example of response
![alt text](https://image.prntscr.com/image/ECigRxeeTGC5g3V_MTfX6g.png "Log Exemple")

## Examples on Slack
![alt text](https://image.prntscr.com/image/fAmdzOYAQ1K1_93pmMnmKw.png "Log Exemple")
![alt text](https://image.prntscr.com/image/wVrD6_aNRMSN79cefs9B1Q.png "Log Exemple")

## TODO
* Check Lazy Requests
* Save requests on database (mongo?)
